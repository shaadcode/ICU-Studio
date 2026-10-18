/* eslint-disable perfectionist/sort-modules */
import type { LanguageCode } from 'iso-639-1';
import { readDir } from '@tauri-apps/plugin-fs';
import type { TLanguageCode } from 'countries-list';
import { join, extname } from '@tauri-apps/api/path';

import type { I18nProjectTree } from '../types';
import type { LocaleInfo } from '@/shared/lib/icu/constants';
import { parseLocale, localeInfoMap } from '@/shared/lib/icu';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type GetProjectDataContext = NonNullable<I18nManagerStore['selectedProject']>;
type Locales = NonNullable<I18nManagerStore['selectedProjectData']>['locales'];

export async function getProjectDataLocaleFolderNamespaceFile(selectedProject: GetProjectDataContext) {
  const locales: Locales = [];
  const filesSet = new Set<string>();

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
      let localeData: undefined | LocaleInfo;
      if (depth === 0 && isDir) {
        const resolved = resolveLocale(entryName, fullPath);
        if (resolved) {
          localeData = resolved.localeInfo;
          locales.push(resolved.locale);
        }
      }

      const node: I18nProjectTree = {
        fullPath,
        value: fullPath,
        isLocale: isDir,
        label: entryName,
        isDirectory: isDir,
        isNamespace: !isDir,
        localeInfo: isDir && localeData
          ? localeData
          : undefined,
      };

      const ext = isDir ? '' : await extname(entry.name);
      if (isDir) {
        node.children = await buildTree(fullPath, depth + 1);
      } else {
        if (ext === 'json') {
          filesSet.add(entryName);
        }
      }
      if (isDir || ext === 'json') {
        nodes.push(node);
      }
    }

    return nodes;
  };

  const tree = await buildTree(selectedProject.baseDirectoryPath);
  const files = [...filesSet];

  return {
    tree,
    locales,
    namespaces: files,
    recentScan: new Date(),
    filesAmount: files.length,
    path: selectedProject.baseDirectoryPath,
    baseLocale: selectedProject.baseLocale ?? '',
    structureType: 'locale-folder-namespace-file',
  } as NonNullable<I18nManagerStore['selectedProjectData']>;
}

type ResolvedLocale = {
  localeInfo: LocaleInfo;
  locale: Locales[number];
};

function resolveLocale(
  entryName: string,
  fullPath: string,
): undefined | ResolvedLocale {
  const directMatch = localeInfoMap[entryName as LanguageCode];
  if (directMatch) {
    return {
      localeInfo: directMatch,
      locale: {
        path: fullPath,
        region: directMatch.region,
        native: directMatch.languageData.native,
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
    localeInfo,
    locale: {
      region,
      path: fullPath,
      native: parsedInfo.languageData.native,
      code: entryName === parsedInfo.languageCode
        ? parsedInfo.languageCode
        : entryName as TLanguageCode,
    },
  };
}
