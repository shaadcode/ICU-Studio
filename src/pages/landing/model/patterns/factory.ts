// shared/config/i18n/patterns/index.ts
import type { StructureType, I18nPatternActions } from './types';
import { addLocaleFolderNamespaceFile } from './locale-folder-namespace-file/addLocale';
import { analyzeLocaleFolderNamespaceFile } from './locale-folder-namespace-file/analyze';
import { deleteLocaleFolderNamespaceFile } from './locale-folder-namespace-file/deleteLocale';
import { addNamespaceFolderNamespaceFile } from './locale-folder-namespace-file/addNamespace';
import { handleWatchLocaleFolderNamespaceFile } from './locale-folder-namespace-file/handleWatch';
import { deleteNamespaceFolderNamespaceFile } from './locale-folder-namespace-file/deleteNamespace';
import { getProjectDataLocaleFolderNamespaceFile } from './locale-folder-namespace-file/getProjectData';

type PatternActionsWithAnalyzer = {
  [K in I18nPatternActions]: any;
} & {
  handleWatch: (data: any) => Promise<any>;
  analyzeProject?: (projectData: any) => Promise<any>;
  analyzeSingleNamespace?: (
    namespace: string,
    localePath: string,
    baseNamespaceKeys: Record<string, any>,
  ) => Promise<any>;
};

export const i18nManagerPatternsActions = {
  'namespace-path-prefix': {
    handleWatch: async () => {},
    analyzeSingleNamespace: async () => {},
    addLocale: addLocaleFolderNamespaceFile,
    deleteLocale: deleteLocaleFolderNamespaceFile,
    addNamespace: addNamespaceFolderNamespaceFile,
    analyzeProject: analyzeLocaleFolderNamespaceFile,
    deleteNamespace: deleteNamespaceFolderNamespaceFile,
    getProjectData: getProjectDataLocaleFolderNamespaceFile,
  },
  'locale-file-nested-namespaces': {
    handleWatch: async () => {},
    analyzeSingleNamespace: async () => {},
    addLocale: addLocaleFolderNamespaceFile,
    deleteLocale: deleteLocaleFolderNamespaceFile,
    addNamespace: addNamespaceFolderNamespaceFile,
    analyzeProject: analyzeLocaleFolderNamespaceFile,
    deleteNamespace: deleteNamespaceFolderNamespaceFile,
    getProjectData: getProjectDataLocaleFolderNamespaceFile,

  },
  'locale-folder-namespace-file': {
    // analyzeSingleNamespace,
    addLocale: addLocaleFolderNamespaceFile,
    deleteLocale: deleteLocaleFolderNamespaceFile,
    addNamespace: addNamespaceFolderNamespaceFile,
    analyzeProject: analyzeLocaleFolderNamespaceFile,
    handleWatch: handleWatchLocaleFolderNamespaceFile,
    deleteNamespace: deleteNamespaceFolderNamespaceFile,
    getProjectData: getProjectDataLocaleFolderNamespaceFile,
  },
} as const satisfies Record<StructureType, PatternActionsWithAnalyzer>;
