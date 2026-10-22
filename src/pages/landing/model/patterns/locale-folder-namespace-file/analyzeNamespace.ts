import { isString } from 'es-toolkit';
import { join } from '@tauri-apps/api/path';

import { readAndFlattenJsonFile } from './analyze';
import type { TranslationEntry, NamespaceAnalysis } from '../types';
import type { Namespace } from '@/pages/landing/config/store/i18nManager/types';

export async function analyzeSingleNamespace(
  namespace: Namespace,
  localePath: string,
  namespaceKeysInBaseLocale: Record<string, any>,
): Promise<NamespaceAnalysis> {
  const namespaceKeysInBaseLocaleEntries = Object.entries(namespaceKeysInBaseLocale);

  const defaultAnalysis: NamespaceAnalysis = {
    totalKeys: 0,
    extraKeys: [],
    missingKeys: 0,
    translatedKeys: 0,
    extraKeysCount: 0,
    missingEntries: [],
    name: namespace.name,
    completionPercentage: 100,
  };

  if (namespaceKeysInBaseLocaleEntries.length === 0) {
    return defaultAnalysis;
  }
  const namespacePath = await join(localePath, `${namespace.name}.json`);

  const targetNamespaceKeys = await readAndFlattenJsonFile(namespacePath);

  if (!targetNamespaceKeys) {
    return {
      ...defaultAnalysis,
      completionPercentage: 0,
      missingKeys: namespaceKeysInBaseLocaleEntries.length,
      missingEntries: namespaceKeysInBaseLocaleEntries.map(([key, baseValue]) => ({
        key,
        namespace,
        status: 'missing',
        baseValue: isString(baseValue) ? baseValue : String(baseValue),
      })),
    };
  }

  let translatedCount = 0;
  const missingEntries: TranslationEntry[] = [];
  for (const [key, baseValue] of namespaceKeysInBaseLocaleEntries) {
    const targetValue = targetNamespaceKeys[key];

    if (!isString(baseValue)) {
      continue;
    }

    const isMissing
      = targetValue === undefined
        || targetValue === null
        || !isString(targetValue)
        || targetValue.trim() === '';

    if (isMissing) {
      missingEntries.push({
        key,
        baseValue,
        namespace,
        status: 'missing',
      });
    } else {
      translatedCount++;
    }
  }

  const extraKeys = Object.keys(targetNamespaceKeys).filter(key => !namespaceKeysInBaseLocale[key]);

  const completionPercentage = Math.round((translatedCount / namespaceKeysInBaseLocaleEntries.length) * 100);

  return {
    extraKeys,
    missingEntries,
    name: namespace.name,
    completionPercentage,
    translatedKeys: translatedCount,
    extraKeysCount: extraKeys.length,
    missingKeys: missingEntries.length,
    totalKeys: Object.keys(targetNamespaceKeys).length,
  };
}
