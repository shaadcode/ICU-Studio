/* eslint-disable perfectionist/sort-modules */
import type { TLanguageCode } from 'countries-list';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { Locale, Project, Namespace } from '../../config/store/i18nManager/types';

export type PatternActionResult = {
  affectedPaths: string[];
};

export type PatternAction<TContext> = (
  ctx: TContext,
) => Promise<PatternActionResult>;

export type AddLocaleContext = BasePatternContext & {
  newLocaleCode: string;
  newLocaleLabel: string;
};

export type AddNamespaceContext = BasePatternContext & {
  namespaceName: string;
  targetLocales: string[];
};

export type DeleteLocaleContext = BasePatternContext & {
  localeCode: string;
  localeNode: I18nProjectTree;
};

export type DeleteNamespaceContext = BasePatternContext & {
  namespaceName: string;
  namespaceNode: I18nProjectTree;
};

export type StructureType
  = | 'namespace-path-prefix'
    | 'locale-folder-namespace-file'
    | 'locale-file-nested-namespaces';

export type I18nPatternActions
  = 'addLocale'
    | 'deleteLocale'
    | 'addNamespace'
    | 'getProjectData'
    | 'deleteNamespace';

export type TranslationEntry = {
  key: string;
  baseValue: string;
  namespace: Namespace;
  translatedValue?: string;
  status: 'empty' | 'missing' | 'translated';
};

export type BasePatternContext = {
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
  setSelectedProjectData: NonNullable<
    I18nManagerStore['actions']['setSelectedProjectData']
  >;
};

export type NamespaceAnalysis = {
  /** Name of the namespace (e.g., "common" or "common.json") */
  name: string;
  /** Total number of translation keys in this namespace (based on the base locale) */
  totalKeys: number;
  /** Number of keys that are not translated in this locale */
  missingKeys: number;
  extraKeys?: string[];
  /** Number of keys present in this locale but not in the base locale */
  extraKeysCount: number;
  /** Number of keys that are translated in this locale */
  translatedKeys: number;
  /** Completion percentage of translations (0 to 100) */
  completionPercentage: number;
  missingEntries?: TranslationEntry[];
  // translatedEntries?: TranslationEntry[];
};

export type ProjectAnalysisResult = {
  /** Total number of translation keys in the base locale (reference) */
  totalKeys: number;
  /** Total number of keys missing across all locales */
  missingKeys: number;
  /** Total number of keys translated across all locales */
  translatedKeys: number;
  /** Total number of namespaces in the project */
  totalNamespaces: number;
  /** Code of the base locale (e.g., "en") */
  baseLocale: Locale | undefined;
  totalPossibleTranslations: number;
  /** Overall completion percentage across all locales (0 to 100) */
  overallCompletionPercentage: number;
  /** Analysis for each locale in the project */
  locales: Record<TLanguageCode, LocaleAnalysis>;
};

export type LocaleAnalysis = {
  /** Locale code (e.g., "en", "fa", "de") */
  code: string;
  /** Total number of translation keys in this locale (across all namespaces) */
  totalKeys: number;
  /** Number of keys that exist in this locale but not in the base locale */
  extraKeys: number;
  /** Number of keys that are not translated in this locale */
  missingKeys: number;
  /** Number of keys that are translated in this locale */
  translatedKeys: number;
  /** Completion percentage of translations (0 to 100) */
  completionPercentage: number;
  /** Analysis for each namespace within this locale */
  namespaces: Record<string, NamespaceAnalysis>;
};

export type BaseTreeNode = {
  /**
   * file or folder full path
   */
  value: string;
  isDirectory: boolean;
  /**
   * file or folder name (without format)
   */
  label: React.ReactNode;
};

export type LocaleTreeNode = BaseTreeNode & {
  type: 'locale';
  children: NamespaceTreeNode[];
  /**
   * Full locale information (language, country, region, native name, and path).
   * Extracted from the `locales` array in `Project`.
   */
  locale: Project['locales'][number];
};

export type NamespaceTreeNode = BaseTreeNode & {
  type: 'namespace';
  /**
   * Namespace file information (name and full path to the JSON file).
   * Extracted from the `namespaces` array in `Project`.
   */
  namespace: Project['namespaces'][number];
};

export type TreeNode = LocaleTreeNode | NamespaceTreeNode;

export type I18nProjectTree = TreeNode;
