import type { Project } from '@/pages/landing/config/store/i18nManager/types';

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
  path: string;
  description: string;
  structureType: StructureType;
  baseLocale?: Project['baseLocale'];
};
