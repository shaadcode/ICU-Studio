import { attemptAsync } from 'es-toolkit';
import { join } from '@tauri-apps/api/path';
import { readDir } from '@tauri-apps/plugin-fs';

import { resolveLocale } from './getProjectData';
import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type GetProjectLocalesContext = {
  projectPath: string;
};

/**
 * Retrieves all valid locales from the base directory.
 * Pattern: `locale-folder-namespace-file`
 */
export async function getLocalesLocaleFolderNamespaceFile({
  projectPath,
}: GetProjectLocalesContext): Promise<NonNullable<I18nManagerStore['selectedProjectData']>['locales']> {
  const locales: Project['locales'] = [];

  await attemptAsync(async () => {
    const entries = await readDir(projectPath);
    for (const entry of entries) {
      if (entry.name.startsWith('.') || !entry.isDirectory) {
        continue;
      }

      const fullPath = await join(projectPath, entry.name);

      const resolved = resolveLocale(entry.name, fullPath);

      if (resolved) {
        locales.push(resolved);
      }
    }
  });

  return locales;
}
