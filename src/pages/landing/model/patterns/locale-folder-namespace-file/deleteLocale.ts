// shared/config/i18n/patterns/locale-folder-namespace-file/deleteLocale.ts
import { attemptAsync } from 'es-toolkit';
import { remove } from '@tauri-apps/plugin-fs';

import type { I18nProjectTree } from '@/shared/lib/mantine/getI18nProjectData';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type DeleteLocaleContext = {
  localeNode: I18nProjectTree;
  setSelectedProjectData: NonNullable<
    I18nManagerStore['actions']['setSelectedProjectData']
  >;
} & NonNullable<I18nManagerStore['selectedProjectData']>;

/**
 * Delete a locale folder with all its namespace files.
 * Pattern: `locale-folder-namespace-file`
 */
export async function deleteLocaleFolderNamespaceFile(params: DeleteLocaleContext) {
  const result = await attemptAsync(async () => {
    const { localeNode, setSelectedProjectData, ...projectData } = params;
    const localeCode = String(localeNode.label);

    await remove(localeNode.fullPath, { recursive: true });

    const updatedTree = projectData.tree.filter(
      node => node.fullPath !== localeNode.fullPath,
    );

    const updatedLocales = projectData.locales.filter(
      l => l.code !== localeCode,
    );

    const updatedBaseLocale
      = projectData.baseLocale === localeCode
        ? updatedLocales[0]?.code ?? ''
        : projectData.baseLocale;

    setSelectedProjectData({
      ...projectData,
      tree: updatedTree,
      locales: updatedLocales,
      baseLocale: updatedBaseLocale,
    });

    return { localeCode };
  });

  return result;
}
