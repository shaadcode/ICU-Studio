import type { I18nProjectTree } from '@/shared/lib/mantine/getI18nProjectData';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type PatternActionResult = {
  affectedPaths: string[];
};

export type I18nPatternsRegistry = Record<StructureType, I18nPattern>;

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

export type BasePatternContext = {
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
  setSelectedProjectData: NonNullable<
    I18nManagerStore['actions']['setSelectedProjectData']
  >;
};

export type I18nPattern = {
  addLocale: PatternAction<AddLocaleContext>;
  deleteLocale: PatternAction<DeleteLocaleContext>;
  addNamespace: PatternAction<AddNamespaceContext>;
  deleteNamespace: PatternAction<DeleteNamespaceContext>;
};
