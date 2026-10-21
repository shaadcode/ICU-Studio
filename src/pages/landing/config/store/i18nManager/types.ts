import type { ICountry, ILanguage, TCountryCode, TLanguageCode } from 'countries-list';

import type { StructureType, I18nProjectTree } from '@/pages/landing/model/patterns/types';

export type Namespace = {
  name: string;
  path: string;
  fileName: string;
  lastModified: Date | null;
  locale: Project['locales'][number];
};

export type Locale = {
  path: string;
  native: string;

  country: ICountry;
  /**
   * ir , us ...
   */
  region?: TCountryCode;
  language: ILanguage & {
    /**
     * fa, en, en-gb ...
     */
    code: TLanguageCode;
  };
};

export type Project = {
  name: string;
  /**
   * project full path
   */
  path: string;
  recentScan: Date;
  description: string;
  locales: Array<Locale>;
  tree: Array<I18nProjectTree>;
  structureType: StructureType;
  namespaces: Array<Namespace>;
  baseLocale: Locale | undefined;
};
