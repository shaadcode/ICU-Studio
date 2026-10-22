import type { WatchEvent } from '@tauri-apps/plugin-fs';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { readAndFlattenJsonFile, analyzeLocaleFolderNamespaceFile } from './analyze';
import type { Locale, Namespace } from '@/pages/landing/config/store/i18nManager/types';

export type HandleWatchParams = {
  path: string;
  isDir: boolean;
  event: WatchEvent;
  baseLocale: Locale;
  locales: Array<Locale>;
  namespaces: Array<Namespace>;
  setProjectAnalysis: NonNullable<I18nManagerStore['actions']>['setProjectAnalysis'];
};

/**
 * Watches file system changes (locale/namespace), invalidates cache, and re-analyzes the project.
 * Pattern: `locale-folder-namespace-file`
 */
export async function handleWatchLocaleFolderNamespaceFile(params: HandleWatchParams) {
  readAndFlattenJsonFile.cache.delete(params.path);
  const analyzedProject = await analyzeLocaleFolderNamespaceFile(params);
  params.setProjectAnalysis(analyzedProject);
}
