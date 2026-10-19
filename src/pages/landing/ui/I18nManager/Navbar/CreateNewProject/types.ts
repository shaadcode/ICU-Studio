export type FileFormat = 'json' | 'yaml' | 'nested-json';

export type StructureType
  = | 'namespace-path-prefix'
    | 'locale-folder-namespace-file'
    | 'locale-file-nested-namespaces';

export type StructureOption = {
  title: string;
  example: string;
  description: string;
  value: StructureType;
  icon: React.ReactNode;
};

export type BaseProjectInfo = {
  name: string;
  baseLocale: string;
  description: string;
  baseDirectoryPath: string;
  structureType: StructureType;
};
