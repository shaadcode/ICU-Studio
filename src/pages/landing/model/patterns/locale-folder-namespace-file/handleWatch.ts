import type { TLanguageCode } from 'countries-list';
import type { WatchEvent } from '@tauri-apps/plugin-fs';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { readAndFlattenJsonFile, analyzeLocaleFolderNamespaceFile } from './analyze';

export type HandleWatchParams = {
  path: string;
  isDir: boolean;
  event: WatchEvent;
  baseLocale: TLanguageCode;
  locales: NonNullable<I18nManagerStore['selectedProjectData']>['locales'];
  namespaces: NonNullable<I18nManagerStore['selectedProjectData']>['namespaces'];
  setProjectAnalysis: NonNullable<I18nManagerStore['actions']>['setProjectAnalysis'];
};

/**
 * Watches file system changes (locale/namespace), invalidates cache, and re-analyzes the project.
 * Pattern: `locale-folder-namespace-file`
 */
export async function handleWatchLocaleFolderNamespaceFile(params: HandleWatchParams) {
  readAndFlattenJsonFile.cache.delete(params.path);
  if (!params.baseLocale) {
    return console.warn('base locale is undefined');
  }
  const analyzedProject = await analyzeLocaleFolderNamespaceFile(params);
  params.setProjectAnalysis(analyzedProject);
}
