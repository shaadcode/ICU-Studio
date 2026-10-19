// shared/config/i18n/patterns/locale-folder-namespace-file/deleteLocale.ts
import { attemptAsync } from 'es-toolkit';
import { remove } from '@tauri-apps/plugin-fs';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type DeleteLocaleContext = {
  locale: NonNullable<I18nManagerStore['selectedProjectData']>['locales'][number];
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
    const { locale, setSelectedProjectData, ...projectData } = params;

    await remove(locale.path, { recursive: true });

    const updatedTree = projectData.tree.filter(
      node => node.fullPath !== locale.path,
    );

    const updatedLocales = projectData.locales.filter(
      l => l.language.code !== locale.language.code,
    );

    const updatedBaseLocale
      = projectData.baseLocale === locale.language.code
        ? updatedLocales[0]!.language.code
        : projectData.baseLocale;

    setSelectedProjectData({
      ...projectData,
      tree: updatedTree,
      locales: updatedLocales,
      baseLocale: updatedBaseLocale,
    });
  });

  return result;
}
