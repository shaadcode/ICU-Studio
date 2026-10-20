// shared/config/i18n/patterns/index.ts
import type { StructureType, I18nPatternActions } from './types';
import { deleteLocale } from './locale-folder-namespace-file/deleteLocale';
import { addNamespace } from './locale-folder-namespace-file/addNamespace';
import { addLocaleFolderNamespaceFile } from './locale-folder-namespace-file/addLocale';
import { analyzeLocaleFolderNamespaceFile } from './locale-folder-namespace-file/analyze';
import { handleWatchLocaleFolderNamespaceFile } from './locale-folder-namespace-file/handleWatch';
import { deleteNamespaceFolderNamespaceFile } from './locale-folder-namespace-file/deleteNamespace';
import { getLocalesLocaleFolderNamespaceFile } from './locale-folder-namespace-file/getProjectLocales';
import { getProjectDataLocaleFolderNamespaceFile } from './locale-folder-namespace-file/getProjectData';
import { handleWatchProjectLocaleFolderNamespaceFile } from './locale-folder-namespace-file/handleWatchProject';

type PatternActionsWithAnalyzer = {
  [K in I18nPatternActions]: any;
} & {
  handleWatch: (data: any) => Promise<any>;
  analyzeProject?: (projectData: any) => Promise<any>;
  getLocales: (baseDirectoryPath: any) => Promise<any>;
  handleWatchProject: (projectPath: any) => Promise<any>;
};

export const i18nManagerPatternsActions = {
  'namespace-path-prefix': {
    deleteLocale,
    addNamespace,
    handleWatch: async () => {},
    handleWatchProject: async () => {},
    addLocale: addLocaleFolderNamespaceFile,
    getLocales: getLocalesLocaleFolderNamespaceFile,
    analyzeProject: analyzeLocaleFolderNamespaceFile,
    deleteNamespace: deleteNamespaceFolderNamespaceFile,
    getProjectData: getProjectDataLocaleFolderNamespaceFile,
  },
  'locale-file-nested-namespaces': {
    deleteLocale,
    addNamespace,
    handleWatch: async () => {},
    handleWatchProject: async () => {},
    addLocale: addLocaleFolderNamespaceFile,
    getLocales: getLocalesLocaleFolderNamespaceFile,
    analyzeProject: analyzeLocaleFolderNamespaceFile,
    deleteNamespace: deleteNamespaceFolderNamespaceFile,
    getProjectData: getProjectDataLocaleFolderNamespaceFile,
  },
  'locale-folder-namespace-file': {
    deleteLocale,
    addNamespace,
    addLocale: addLocaleFolderNamespaceFile,
    getLocales: getLocalesLocaleFolderNamespaceFile,
    analyzeProject: analyzeLocaleFolderNamespaceFile,
    handleWatch: handleWatchLocaleFolderNamespaceFile,
    deleteNamespace: deleteNamespaceFolderNamespaceFile,
    getProjectData: getProjectDataLocaleFolderNamespaceFile,
    handleWatchProject: handleWatchProjectLocaleFolderNamespaceFile,
  },
} as const satisfies Record<StructureType, PatternActionsWithAnalyzer>;
