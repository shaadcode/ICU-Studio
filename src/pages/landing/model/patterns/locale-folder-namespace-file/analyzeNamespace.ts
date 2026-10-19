import { isString } from 'es-toolkit';
import { join } from '@tauri-apps/api/path';

import type { NamespaceAnalysis } from '../types';
import { readAndFlattenJsonFile } from './analyze';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export async function analyzeSingleNamespace(
  namespace: NonNullable<I18nManagerStore['selectedProjectData']>['namespaces'][number],
  localePath: string,
  baseNamespaceKeys: Record<string, any>,
): Promise<{ extraKeysCount: number; translatedCount: number; namespaceAnalysis: NamespaceAnalysis }> {
  const baseEntries = Object.entries(baseNamespaceKeys);

  const defaultAnalysis: NamespaceAnalysis = {
    totalKeys: 0,
    missingKeys: 0,
    translatedKeys: 0,
    name: namespace.name,
    completionPercentage: 100,
  };

  if (baseEntries.length === 0) {
    return { extraKeysCount: 0, translatedCount: 0, namespaceAnalysis: defaultAnalysis };
  }
  const namespacePath = await join(localePath, `${namespace.name}.json`);

  const targetKeys = await readAndFlattenJsonFile(namespacePath);

  if (!targetKeys) {
    return {
      extraKeysCount: 0,
      translatedCount: 0,
      namespaceAnalysis: {
        ...defaultAnalysis,
        completionPercentage: 0,
        missingKeys: baseEntries.length,
      },
    };
  }

  let translatedCount = 0;
  let extraKeysCount = 0;

  baseEntries.forEach(([key, value]) => {
    if (isString(value) && targetKeys[key]) {
      translatedCount++;
    }
  });

  extraKeysCount = Object.keys(targetKeys).filter(key => !baseNamespaceKeys[key]).length;

  const missingCount = baseEntries.length - translatedCount;
  const completionPercentage = Math.round((translatedCount / baseEntries.length) * 100);

  return {
    extraKeysCount,
    translatedCount,
    namespaceAnalysis: {
      name: namespace.name,
      completionPercentage,
      missingKeys: missingCount,
      translatedKeys: translatedCount,
      totalKeys: Object.keys(targetKeys).length,
    },
  };
}
