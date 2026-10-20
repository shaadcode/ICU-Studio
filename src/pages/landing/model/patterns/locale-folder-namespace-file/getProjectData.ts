/* eslint-disable perfectionist/sort-modules */
import type { LanguageCode } from 'iso-639-1';
import type { TLanguageCode } from 'countries-list';
import { join, extname } from '@tauri-apps/api/path';
import type { UnwatchFn } from '@tauri-apps/plugin-fs';
import { stat, watch, readDir } from '@tauri-apps/plugin-fs';

import type { HandleWatchParams } from './handleWatch';
import type { LocaleInfo } from '@/shared/lib/icu/constants';
import { parseLocale, localeInfoMap } from '@/shared/lib/icu';
import type { TreeNode, LocaleTreeNode, NamespaceTreeNode } from '../types';
import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { BaseProjectInfo } from '@/pages/landing/ui/I18nManager/Navbar/CreateNewProject/types';

type GetProjectDataContext = {
  project: BaseProjectInfo;
  onWatch: (e: HandleWatchParams) => void;
  setProjectAnalysis: NonNullable<I18nManagerStore['actions']>['setProjectAnalysis'];

};
type Locales = NonNullable<I18nManagerStore['selectedProjectData']>['locales'];
/**
 * get project data
 * Pattern: `locale-folder-namespace-file`
 */
export async function getProjectDataLocaleFolderNamespaceFile({
  project,
  onWatch,
  setProjectAnalysis,
}: GetProjectDataContext) {
  const locales: Locales = [];
  const namespacesSet = new Set<Project['namespaces'][number]>();
  const stopWatching: Array<UnwatchFn> = [];
  let localeData: undefined | Locales[number];

  const buildTree = async (dirPath: string, depth = 0): Promise<TreeNode[]> => {
    const entries = await readDir(dirPath);
    const nodes: TreeNode[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        continue;
      }

      const fullPath = await join(dirPath, entry.name);
      const entryName = entry.name.split('.')[0] as string;
      const baseNode = {
        value: fullPath,
        label: entryName,
        isDirectory: entry.isDirectory,
      } as const satisfies Partial<TreeNode>;
      if (depth === 0 && entry.isDirectory) {
        const resolved = resolveLocale(entryName, fullPath);
        if (resolved) {
          locales.push(resolved);

          const children = await buildTree(fullPath, depth + 1);

          const localeNode: LocaleTreeNode = {
            ...baseNode,
            type: 'locale',
            locale: resolved,
            children: children.filter(isNamespaceNode),
          };

          nodes.push(localeNode);
          continue;
        }
      }

      const ext = entry.isDirectory ? '' : await extname(entry.name);
      if (!entry.isDirectory && ext === 'json') {
        const fileStat = await stat(fullPath);
        const namespace: Project['namespaces'][number] = {
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

  const tree = await buildTree(project.projectPath);
  const namespaces = [...namespacesSet];

  await Promise.all(
    namespaces.map(async (namespace) => {
      const stop = await watch(namespace.path, (event) => {
        if (!localeData) {
          console.error('localeData is undefined  in getProjectData');
          return;
        }
        onWatch({
          event,
          locales,
          namespaces,
          isDir: false,
          setProjectAnalysis,
          path: namespace.path,
          baseLocale: localeData.language.code,
        });
      });

      stopWatching.push(stop);
    }),
  );
  return {
    stopWatching,
    data: {
      tree,
      locales,
      namespaces,
      recentScan: new Date(),
      path: project.projectPath,
      baseLocale: project.baseLocale,
      structureType: 'locale-folder-namespace-file',
    } as Project,
  };
}

export function resolveLocale(
  localeCode: string,
  localePath: string,
): undefined | Locales[number] {
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

  return {
    region,
    path: localePath,
    country: localeInfo.country,
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
