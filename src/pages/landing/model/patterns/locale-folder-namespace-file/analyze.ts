// shared/config/i18n/patterns/locale-folder-namespace-file/analyze.ts
import { join } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { isString, attemptAsync, flattenObject } from 'es-toolkit';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { LocaleAnalysis, NamespaceAnalysis, ProjectAnalysisResult } from '../types';

type AnalyzeContext = NonNullable<I18nManagerStore['selectedProjectData']>;

export async function analyzeLocaleFolderNamespaceFile(
  projectData: AnalyzeContext,
): Promise<ProjectAnalysisResult> {
  const { locales, baseLocale, namespaces } = projectData;

  const result: ProjectAnalysisResult = {
    baseLocale,
    locales: {},
    totalKeys: 0,
    missingKeys: 0,
    translatedKeys: 0,
    overallCompletionPercentage: 0,
    totalNamespaces: namespaces.length,
  };

  const namespaceAnalysis = {

  } as Record<string, any>;
  const baseLocaleData = locales.find(l => l.code === baseLocale);
  if (!baseLocaleData) {
    throw new Error(`Base locale "${baseLocale}" not found in project.`);
  }

  const baseLocaleKeys: Record<string, object> = {};
  await Promise.all(
    namespaces.map(async (ns) => {
      const filePath = await join(baseLocaleData.path, `${ns}.json`);
      const [error, content] = await attemptAsync(() => readTextFile(filePath));

      if (!error && content) {
        const [, json] = await attemptAsync(() => JSON.parse(content));
        if (!json) {
          return;
        }
        try {
          const keys = flattenObject(json);
          baseLocaleKeys[ns] = keys;

          const allKeysNamespace = Object.keys(keys).length;
          namespaceAnalysis[ns] = {
            totalKeys: allKeysNamespace,
          };
          result.totalKeys += allKeysNamespace;
        } catch {
          baseLocaleKeys[ns] = [];
        }
      } else {
        baseLocaleKeys[ns] = [];
      }
    }),
  );

  await Promise.all(
    locales.map(async (locale) => {
      const localeAnalysis: LocaleAnalysis = {
        extraKeys: 0,
        totalKeys: 0,
        missingKeys: 0,
        namespaces: {},
        code: locale.code,
        translatedKeys: 0,
        completionPercentage: 0,
      };

      let localeTranslatedCount = 0;

      await Promise.all(
        namespaces.map(async (ns) => {
          const namespaceKeysInBaseLocale = baseLocaleKeys[ns] || [];
          const namespaceEntriesInBaseLocale = Object.entries(namespaceKeysInBaseLocale);
          const nsAnalysis: NamespaceAnalysis = {
            name: ns,
            totalKeys: 0,
            missingKeys: 0,
            translatedKeys: 0,
            completionPercentage: 100,
          };

          if (namespaceEntriesInBaseLocale.length === 0) {
            localeAnalysis.namespaces[ns] = nsAnalysis;
            return;
          }

          const namespacePath = await join(locale.path, `${ns}.json`);
          const [error, namespaceContent] = await attemptAsync(() => readTextFile(namespacePath));

          if (error || !namespaceContent) {
            localeAnalysis.namespaces[ns] = nsAnalysis;
            return;
          }

          try {
            const namespaceJson = JSON.parse(namespaceContent);
            const namespaceFlattenedKeys = flattenObject(namespaceJson);
            const namespaceFlattenedEntries = Object.entries(namespaceFlattenedKeys);

            let translatedInNs = 0;
            namespaceEntriesInBaseLocale.forEach(([
              baseLocaleNamespaceKey,
              baseLocaleNamespaceValue,
            ]) => {
              if (isString(baseLocaleNamespaceValue)
                && namespaceFlattenedKeys[baseLocaleNamespaceKey]) {
                translatedInNs++;
              }
            });

            const missingInNs = namespaceEntriesInBaseLocale.length - translatedInNs;
            const extraInNs = namespaceEntriesInBaseLocale.filter(([
              baseLocaleNamespaceKey,
              // baseLocaleNamespaceValue,
            ]) => !namespaceFlattenedKeys[baseLocaleNamespaceKey]).length;

            nsAnalysis.translatedKeys = translatedInNs;
            nsAnalysis.missingKeys = missingInNs;
            nsAnalysis.completionPercentage = Math.round((translatedInNs / namespaceEntriesInBaseLocale.length) * 100);
            nsAnalysis.totalKeys = namespaceFlattenedEntries.length;

            localeAnalysis.namespaces[ns] = nsAnalysis;
            localeTranslatedCount += translatedInNs;
            localeAnalysis.extraKeys += extraInNs;
          } catch {
            localeAnalysis.namespaces[ns] = nsAnalysis;
          }
        }),
      );

      localeAnalysis.translatedKeys = localeTranslatedCount;
      localeAnalysis.missingKeys = localeAnalysis.totalKeys - localeTranslatedCount;
      localeAnalysis.completionPercentage = localeAnalysis.totalKeys > 0
        ? Math.round((localeTranslatedCount / localeAnalysis.totalKeys) * 100)
        : 100;

      result.locales[locale.code] = localeAnalysis;
      result.translatedKeys += localeTranslatedCount;
    }),
  );

  const totalPossibleTranslations = result.totalKeys * locales.length;
  result.overallCompletionPercentage = totalPossibleTranslations > 0
    ? Math.round((result.translatedKeys / totalPossibleTranslations) * 100)
    : 100;
  result.missingKeys = totalPossibleTranslations - result.translatedKeys;

  return result;
}
