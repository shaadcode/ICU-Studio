/* eslint-disable perfectionist/sort-modules */
import { countries } from 'countries-list';
import type { LanguageCode } from 'iso-639-1';
import { join, extname } from '@tauri-apps/api/path';
import type { UnwatchFn } from '@tauri-apps/plugin-fs';
import { stat, watch, readDir } from '@tauri-apps/plugin-fs';
import type { TCountryCode, TLanguageCode } from 'countries-list';

import type { HandleWatchParams } from '../handleWatch';
import type { LocaleInfo } from '@/shared/lib/icu/constants';
import { parseLocale, localeInfoMap } from '@/shared/lib/icu';
import type { TreeNode, LocaleTreeNode, NamespaceTreeNode } from '../../types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { Locale, Project, Namespace } from '@/pages/landing/config/store/i18nManager/types';
import type { BaseProjectInfo } from '@/pages/landing/ui/I18nManager/Navbar/CreateNewProject/types';

type GetProjectDataContext = {
  project: BaseProjectInfo;
  onWatch: (e: HandleWatchParams) => void;
  setProjectAnalysis: NonNullable<I18nManagerStore['actions']>['setProjectAnalysis'];
  setChangedJsonFileInWatch: NonNullable<I18nManagerStore['actions']>['setChangedJsonFileInWatch'];
  setChangedJsonFilePathInOut: NonNullable<I18nManagerStore['actions']>['setChangedJsonFilePathInOut'];
};
/**
 * get project data
 * Pattern: `locale-folder-namespace-file`
 */
export async function getProjectDataLocaleFolderNamespaceFile({
  project,
  onWatch,
  setProjectAnalysis,
  setChangedJsonFileInWatch,
  setChangedJsonFilePathInOut,
}: GetProjectDataContext) {
  const locales: Array<Locale> = [];
  const namespacesSet = new Set<Project['namespaces'][number]>();
  const stopWatching: Array<UnwatchFn> = [];

  if (!project.baseLocale) {
    throw console.error('base locale is undefined');
  }
  const tree = await buildTree({
    depth: 0,
    path: project.path,
  });
  const namespaces = [...namespacesSet];

  // watching namespaces
  const paths = namespaces.map(ns => ns.path);
  const stop = await watch(paths, (event) => {
    if (!project.baseLocale) {
      return console.error('baseLocale is undefined in locale-namespace watch');
    }
    onWatch({
      event,
      locales,
      namespaces,
      isDir: false,
      setProjectAnalysis,
      setChangedJsonFileInWatch,
      setChangedJsonFilePathInOut,
      path: event.paths[0] as string,
      baseLocale: project.baseLocale,
    });
  });
  stopWatching.push(stop);

  return {
    stopWatching,
    data: {
      tree,
      locales,
      namespaces,
      path: project.path,
      recentScan: new Date(),
      structureType: 'locale-folder-namespace-file',
    } as Project,
  };

  type BuildTreeParams = {
    path: string;
    depth: number;
    locale?: Locale;
  };
  async function buildTree({ path, depth, locale }: BuildTreeParams): Promise<TreeNode[]> {
    const entries = await readDir(path);
    const nodes: TreeNode[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        continue;
      }

      const fullPath = await join(path, entry.name);
      const entryName = entry.name.split('.')[0] as string;
      const baseNode = {
        value: fullPath,
        label: entryName,
        isDirectory: entry.isDirectory,
      } as const satisfies Partial<TreeNode>;

      // locale node
      if (depth === 0 && entry.isDirectory) {
        const resolvedLocale = resolveLocale(entryName, fullPath);
        if (resolvedLocale) {
          locales.push(resolvedLocale);
          const children = await buildTree({
            depth,
            path: fullPath,
            locale: resolvedLocale,
          });

          const localeNode: LocaleTreeNode = {
            ...baseNode,
            type: 'locale',
            locale: resolvedLocale,
            children: children.filter(isNamespaceNode),
          };

          nodes.push(localeNode);
          continue;
        }
      }

      // namespace node
      const ext = entry.isDirectory ? '' : await extname(entry.name);
      if (!entry.isDirectory && ext === 'json') {
        if (!locale) {
          throw console.error('locale is undefined(for namespace)');
        }
        const fileStat = await stat(fullPath);
        const namespace: Namespace = {
          locale,
          path: fullPath,
          name: entryName,
          fileName: entry.name,
          lastModified: fileStat.mtime,
        };
        const namespaceNode: NamespaceTreeNode = {
          ...baseNode,
          namespace,
          type: 'namespace',
        };

        namespacesSet.add(namespace);
        nodes.push(namespaceNode);
      }
    }

    return nodes;
  };
}

export function resolveLocale(
  localeCode: string,
  localePath: string,
): Locale | undefined {
  const directMatch = localeInfoMap[localeCode as LanguageCode];
  if (directMatch) {
    return {
      path: localePath,
      region: directMatch.region,
      country: directMatch.country,
      native: directMatch.languageData.native,
      language: {
        ...directMatch.languageData,
        code: localeCode === directMatch.languageCode
          ? directMatch.languageCode
          : localeCode as TLanguageCode,
      },
    };
  }

  const parsed = parseLocale(localeCode);
  const parsedInfo = parsed.language
    ? localeInfoMap[parsed.language as LanguageCode]
    : undefined;

  if (!parsedInfo) {
    console.warn('locale is invalid:', localeCode);
    return undefined;
  }
  const region = parsed.region ?? parsedInfo.region;

  const localeInfo: LocaleInfo = {
    ...parsedInfo,
    region,
  };

  const countryData = countries[parsed.region as TCountryCode] ?? localeInfo.country;

  return {
    region,
    path: localePath,
    country: countryData,
    native: parsedInfo.languageData.native,
    language: {
      ...localeInfo.languageData,
      code: localeCode === parsedInfo.languageCode
        ? parsedInfo.languageCode
        : localeCode as TLanguageCode,
    },
  };
}

export function isLocaleNode(node: TreeNode): node is LocaleTreeNode {
  return node.type === 'locale';
}

export function isNamespaceNode(node: TreeNode): node is NamespaceTreeNode {
  return node.type === 'namespace';
}
