import type { I18nProjectTree } from '@/shared/lib/mantine/getI18nProjectData';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

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

export type I18nPatternActions
  = 'addLocale'
    | 'deleteLocale'
    | 'addNamespace'
    | 'deleteNamespace';

export type DeleteNamespaceContext = BasePatternContext & {
  namespaceName: string;
  namespaceNode: I18nProjectTree;
};

export type StructureType
  = | 'namespace-path-prefix'
    | 'locale-folder-namespace-file'
    | 'locale-file-nested-namespaces';

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
  /** Number of keys that are translated in this locale */
  translatedKeys: number;
  /** Completion percentage of translations (0 to 100) */
  completionPercentage: number;
};

export type ProjectAnalysisResult = {
  /** Total number of translation keys in the base locale (reference) */
  totalKeys: number;
  /** Code of the base locale (e.g., "en") */
  baseLocale: string;
  /** Total number of keys missing across all locales */
  missingKeys: number;
  /** Total number of keys translated across all locales */
  translatedKeys: number;
  /** Total number of namespaces in the project */
  totalNamespaces: number;
  /** Overall completion percentage across all locales (0 to 100) */
  overallCompletionPercentage: number;
  /** Analysis for each locale in the project */
  locales: Record<string, LocaleAnalysis>;
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
