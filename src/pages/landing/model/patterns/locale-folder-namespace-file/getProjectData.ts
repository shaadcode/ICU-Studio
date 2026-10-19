/* eslint-disable perfectionist/sort-modules */
import type { LanguageCode } from 'iso-639-1';
import type { TLanguageCode } from 'countries-list';
import { join, extname } from '@tauri-apps/api/path';
import { watch, readDir } from '@tauri-apps/plugin-fs';
import type { UnwatchFn } from '@tauri-apps/plugin-fs';

import type { I18nProjectTree } from '../types';
import type { HandleWatchParams } from './handleWatch';
import type { LocaleInfo } from '@/shared/lib/icu/constants';
import { parseLocale, localeInfoMap } from '@/shared/lib/icu';
import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { BaseProjectInfo } from '@/pages/landing/ui/I18nManager/Navbar/CreateNewProject/types';

type GetProjectDataContext = {
  project: BaseProjectInfo;
  onWatch: (e: HandleWatchParams) => void;
  setProjectAnalysis: NonNullable<I18nManagerStore['actions']>['setProjectAnalysis'];

};
type Locales = NonNullable<I18nManagerStore['selectedProjectData']>['locales'];

export async function getProjectDataLocaleFolderNamespaceFile({
  project,
  onWatch,
  setProjectAnalysis,
}: GetProjectDataContext) {
  const locales: Locales = [];
  const namespacesSet = new Set<{
    name: string;
    path: string;
  }>();
  const stopWatching: Array<UnwatchFn> = [];
  let localeData: undefined | Locales[number];

  const buildTree = async (dirPath: string, depth = 0): Promise<I18nProjectTree[]> => {
    const entries = await readDir(dirPath);
    const nodes: I18nProjectTree[] = [];
    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        continue;
      }
      const fullPath = await join(dirPath, entry.name);
      const isDir = entry.isDirectory ?? false;
      const entryName = entry.name.split('.')[0] as string;
      if (depth === 0 && isDir) {
        const resolved = resolveLocale(entryName, fullPath);
        if (resolved) {
          localeData = resolved;
          locales.push(resolved);
        }
      }

      const node: I18nProjectTree = {
        fullPath,
        value: fullPath,
        isLocale: isDir,
        label: entryName,
        isDirectory: isDir,
        isNamespace: !isDir,
        locale: isDir && localeData
          ? localeData
          : undefined,
      };

      const ext = isDir ? '' : await extname(entry.name);
      if (isDir) {
        node.children = await buildTree(fullPath, depth + 1);
      } else {
        if (ext === 'json') {
          namespacesSet.add({
            path: fullPath,
            name: entryName,
          });
        }
      }
      if (isDir || ext === 'json') {
        nodes.push(node);
      }
    }

    return nodes;
  };

  const tree = await buildTree(project.baseDirectoryPath);
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
      filesAmount: namespaces.length,
      path: project.baseDirectoryPath,
      baseLocale: project.baseLocale ?? '',
      structureType: 'locale-folder-namespace-file',
    } as Project,
  };
}

function resolveLocale(
  entryName: string,
  fullPath: string,
): undefined | Locales[number] {
  const directMatch = localeInfoMap[entryName as LanguageCode];
  if (directMatch) {
    return {
      path: fullPath,
      region: directMatch.region,
      country: directMatch.country,
      native: directMatch.languageData.native,
      language: {
        ...directMatch.languageData,
        code: entryName === directMatch.languageCode
          ? directMatch.languageCode
          : entryName as TLanguageCode,
      },
    };
  }

  const parsed = parseLocale(entryName);
  const parsedInfo = parsed.language
    ? localeInfoMap[parsed.language as LanguageCode]
    : undefined;

  if (!parsedInfo) {
    console.warn('locale is invalid:', entryName);
    return undefined;
  }

  const region = parsed.region ?? parsedInfo.region;

  const localeInfo: LocaleInfo = {
    ...parsedInfo,
    region,
  };

  return {
    region,
    path: fullPath,
    country: localeInfo.country,
    native: parsedInfo.languageData.native,
    language: {
      ...localeInfo.languageData,
      code: entryName === parsedInfo.languageCode
        ? parsedInfo.languageCode
        : entryName as TLanguageCode,
    },
  };
}
