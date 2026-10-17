// shared/config/i18n/patterns/index.ts
import type { StructureType, I18nPatternActions } from './types';
import { addLocaleFolderNamespaceFile } from './locale-folder-namespace-file/addLocale';
import { analyzeLocaleFolderNamespaceFile } from './locale-folder-namespace-file/analyze';
import { deleteLocaleFolderNamespaceFile } from './locale-folder-namespace-file/deleteLocale';
import { addNamespaceFolderNamespaceFile } from './locale-folder-namespace-file/addNamespace';
import { deleteNamespaceFolderNamespaceFile } from './locale-folder-namespace-file/deleteNamespace';

type PatternActionsWithAnalyzer = {
  [K in I18nPatternActions]: any;
} & {
  analyze?: (projectData: any) => Promise<any>;
};

export const i18nManagerPatternsActions = {
  'namespace-path-prefix': {
    addLocale: addLocaleFolderNamespaceFile,
    analyze: analyzeLocaleFolderNamespaceFile,
    deleteLocale: deleteLocaleFolderNamespaceFile,
    addNamespace: addNamespaceFolderNamespaceFile,
    deleteNamespace: deleteNamespaceFolderNamespaceFile,
  },
  'locale-folder-namespace-file': {
    addLocale: addLocaleFolderNamespaceFile,
    analyze: analyzeLocaleFolderNamespaceFile,
    deleteLocale: deleteLocaleFolderNamespaceFile,
    addNamespace: addNamespaceFolderNamespaceFile,
    deleteNamespace: deleteNamespaceFolderNamespaceFile,
  },
  'locale-file-nested-namespaces': {
    addLocale: addLocaleFolderNamespaceFile,
    analyze: analyzeLocaleFolderNamespaceFile,
    deleteLocale: deleteLocaleFolderNamespaceFile,
    addNamespace: addNamespaceFolderNamespaceFile,
    deleteNamespace: deleteNamespaceFolderNamespaceFile,
  },
} as const satisfies Record<StructureType, PatternActionsWithAnalyzer>;
