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
  setChangedJsonFileInWatch: NonNullable<I18nManagerStore['actions']>['setChangedJsonFileInWatch'];
  setChangedJsonFilePathInOut: NonNullable<I18nManagerStore['actions']>['setChangedJsonFilePathInOut'];
};

/**
 * Watches file system changes (locale/namespace), invalidates cache, and re-analyzes the project.
 * Pattern: `locale-folder-namespace-file`
 */
export async function handleWatchLocaleFolderNamespaceFile(params: HandleWatchParams) {
  const firstJsonFilePath = params.event.paths.find(p => p.endsWith('.json'));
  if (firstJsonFilePath) {
    params.setChangedJsonFilePathInOut(firstJsonFilePath);
    params.setChangedJsonFileInWatch(prev => prev + 1);
  }

  readAndFlattenJsonFile.cache.delete(params.path);
  const analyzedProject = await analyzeLocaleFolderNamespaceFile(params);
  params.setProjectAnalysis(analyzedProject);
}
