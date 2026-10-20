import type { LiteralUnion } from 'type-fest';
import type { TCountryCode } from 'countries-list';

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
  description: string;
  projectPath: string;
  structureType: StructureType;
  baseLocale: LiteralUnion<TCountryCode, string>;
};
