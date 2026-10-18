import { attemptAsync } from 'es-toolkit';
import { join } from '@tauri-apps/api/path';
import type { LanguageCode } from 'iso-639-1';
import { mkdir, writeTextFile } from '@tauri-apps/plugin-fs';

import type { I18nProjectTree } from '../types';
import { parseLocale, localeInfoMap } from '@/shared/lib/icu';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type AddLocaleContext = {
  newLocaleCode: string;
  newLocaleLabel: string;
  setSelectedProjectData: NonNullable<I18nManagerStore['actions']['setSelectedProjectData']>;
} & NonNullable<I18nManagerStore['selectedProjectData']>;

/**
 * add a locale folder with all its namespace files.
 * Pattern: `locale-folder-namespace-file`
 */
export async function addLocaleFolderNamespaceFile(params: AddLocaleContext) {
  const result = await attemptAsync(async () => {
    const { newLocaleCode, setSelectedProjectData, ...projectData } = params;

    const localeFolderPath = await join(projectData.path, newLocaleCode);
    await mkdir(localeFolderPath);

    const localeTreeNode = {
      isLocale: true,
      isDirectory: true,
      isNamespace: false,
      label: newLocaleCode,
      value: localeFolderPath,
      fullPath: localeFolderPath,
      children: [] as Array<I18nProjectTree>,
    } as const satisfies I18nProjectTree;

    const files = await Promise.all(
      projectData.namespaces.map(async (ns) => {
        const newNamespaceFilePath = await join(localeFolderPath, `${ns}.json`);
        const content = '{}\n';

        await writeTextFile(newNamespaceFilePath, content);
        const namespaceTreeNode = {
          label: ns,
          isLocale: false,
          isNamespace: true,
          isDirectory: false,
          value: newNamespaceFilePath,
          fullPath: newNamespaceFilePath,
        } as const satisfies I18nProjectTree;
        localeTreeNode.children.push(namespaceTreeNode);
        return { content, path: newNamespaceFilePath };
      }),
    );
    const parsedLocale = parseLocale(newLocaleCode);
    const localeInfo = localeInfoMap[parsedLocale.language as LanguageCode];
    if (!localeInfo) {
      throw new Error('locale is invalid');
    }
    setSelectedProjectData({
      ...projectData,
      tree: [...projectData.tree, localeTreeNode],
      locales: [
        ...projectData.locales,
        {
          path: localeFolderPath,
          code: localeInfo.languageCode,
          native: localeInfo.languageData.native,
        },
      ],
    });
    return { files, localePath: localeFolderPath };
  });

  return result;
}
