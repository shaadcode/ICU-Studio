import { attemptAsync } from 'es-toolkit';
import { remove } from '@tauri-apps/plugin-fs';

import type { Locale } from '@/pages/landing/config/store/i18nManager/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type DeleteLocaleContext = {
  locale: Locale;
  setSelectedProjectData: NonNullable<
    I18nManagerStore['actions']['setSelectedProjectData']
  >;
} & NonNullable<I18nManagerStore['selectedProjectData']>;

/**
 * Delete a locale folder with all its namespace files.
 * Pattern: `locale-folder-namespace-file`
 */
export async function deleteLocale(params: DeleteLocaleContext) {
  const { locale, setSelectedProjectData, ...projectData } = params;

  return attemptAsync(async () => {
    await remove(locale.path, { recursive: true });

    const updatedLocales = projectData.locales.filter(
      l => l.language.code !== locale.language.code,
    );

    setSelectedProjectData({
      ...projectData,
      locales: updatedLocales,
      tree: projectData.tree.filter(node => node.value !== locale.path),
    });
  });
}
