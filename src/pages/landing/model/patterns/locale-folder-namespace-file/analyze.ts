import { readTextFile } from '@tauri-apps/plugin-fs';
import { uniqBy, attempt, memoize, attemptAsync, flattenObject } from 'es-toolkit';

import { analyzeSingleNamespace } from './analyzeNamespace';
import type { LocaleAnalysis, ProjectAnalysisResult } from '../types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { Locale, Namespace } from '@/pages/landing/config/store/i18nManager/types';

type AnalyzeContext = {
  baseLocale: Locale;
  locales: Array<Locale>;
  namespaces: Array<Namespace>;
};

export const readAndFlattenJsonFile = memoize(readAndFlattenJsonFileRaw, {
  getCacheKey: path => path,
});

export function invalidateJsonFileCache(path: string) {
  readAndFlattenJsonFile.cache.delete(path);
}

export async function extractBaseLocaleKeys(
  namespaces: Array<Namespace>,
) {
  const baseLocaleKeys: Record<string, Record<string, any>> = {};
  let totalBaseKeys = 0;

  await Promise.all(
    namespaces.map(async (ns) => {
      const keys = await readAndFlattenJsonFile(ns.path);

      if (keys) {
        baseLocaleKeys[ns.name] = keys;
        totalBaseKeys += Object.keys(keys).length;
      } else {
        baseLocaleKeys[ns.name] = {};
      }
    }),
  );

  return { totalBaseKeys, baseLocaleKeys };
};

export async function readAndFlattenJsonFileRaw(path: string): Promise<undefined | Record<string, any>> {
  const [readError, content] = await attemptAsync(() => readTextFile(path));

  if (readError || !content) {
    return undefined;
  }

  const [parseError, json] = await attemptAsync(() => JSON.parse(content));
  if (parseError || !json) {
    return undefined;
  }

  const [flattenError, flattened] = attempt(() => flattenObject(json));
  if (flattenError || !flattened) {
    return undefined;
  }

  return flattened;
}

export async function analyzeLocaleFolderNamespaceFile(
  { locales, baseLocale, namespaces }: AnalyzeContext,

): Promise<ProjectAnalysisResult> {
  const uniqueNamespaces = uniqBy(namespaces, ns => ns.name);
  const baseLocaleData = locales.find(l => l.language.code === baseLocale?.language.code);

  if (!baseLocaleData) {
    throw new Error(`Base locale "${baseLocale}" not found in project.`);
  }

  const baseLocaleNamespaces = namespaces
    .filter(ns => ns.locale.language.code === baseLocale?.language.code);
  const { totalBaseKeys, baseLocaleKeys } = await extractBaseLocaleKeys(
    baseLocaleNamespaces,
  );

  const analyzedLocales: Record<string, LocaleAnalysis> = {};
  let totalTranslatedKeysInAllNamespacesInAllLocales = 0;

  await Promise.all(
    locales.map(async (locale) => {
      const analysis = await analyzeSingleLocale(
        locale,
        uniqueNamespaces,
        baseLocaleKeys,
        totalBaseKeys,
      );
      analyzedLocales[locale.language.code] = analysis;
      totalTranslatedKeysInAllNamespacesInAllLocales += analysis.translatedKeys;
    }),
  );
  const totalPossibleTranslations = totalBaseKeys * locales.length;
  const overallCompletionPercentage = totalPossibleTranslations > 0
    ? Math.round((totalTranslatedKeysInAllNamespacesInAllLocales / totalPossibleTranslations) * 100)
    : 100;

  return {
    baseLocale,
    locales: analyzedLocales,
    totalKeys: totalBaseKeys,
    totalPossibleTranslations,
    overallCompletionPercentage,
    totalNamespaces: uniqueNamespaces.length,
    translatedKeys: totalTranslatedKeysInAllNamespacesInAllLocales,
    missingKeys: totalPossibleTranslations - totalTranslatedKeysInAllNamespacesInAllLocales,
  };
}

async function analyzeSingleLocale(
  locale: Locale,
  namespaces: NonNullable<I18nManagerStore['selectedProjectData']>['namespaces'],
  baseLocaleKeys: Record<string, Record<string, any>>,
  totalBaseKeys: number,
): Promise<LocaleAnalysis> {
  const localeAnalysis: LocaleAnalysis = {
    totalKeys: 0,
    extraKeys: 0,
    namespaces: {},
    missingKeys: 0,
    translatedKeys: 0,
    completionPercentage: 0,
    code: locale.language.code,
  };

  let totalTranslatedKeysInCurrentLocale = 0;

  await Promise.all(
    namespaces.map(async (ns) => {
      const baseKeysForNs = baseLocaleKeys[ns.name] || {};
      const namespaceAnalysis = await analyzeSingleNamespace(
        ns,
        locale.path,
        baseKeysForNs,
      );

      localeAnalysis.namespaces[ns.name] = namespaceAnalysis;
      totalTranslatedKeysInCurrentLocale += namespaceAnalysis.translatedKeys;
      localeAnalysis.missingKeys += namespaceAnalysis.missingKeys;
      localeAnalysis.extraKeys += namespaceAnalysis.extraKeysCount;
      localeAnalysis.totalKeys += namespaceAnalysis.totalKeys;
    }),
  );

  localeAnalysis.translatedKeys = totalTranslatedKeysInCurrentLocale;

  localeAnalysis.completionPercentage = totalBaseKeys > 0
    ? Math.round((totalTranslatedKeysInCurrentLocale / totalBaseKeys) * 100)
    : 100;

  return localeAnalysis;
}
