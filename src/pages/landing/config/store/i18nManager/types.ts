import type { ICountry, ILanguage, TCountryCode, TLanguageCode } from 'countries-list';

import type { StructureType, I18nProjectTree } from '@/pages/landing/model/patterns/types';

export type Project = {
  name: string;
  /**
   * project full path
   */
  path: string;
  recentScan: Date;
  description: string;
  filesAmount: number;
  baseLocale: TLanguageCode;
  tree: Array<I18nProjectTree>;
  structureType: StructureType;
  namespaces: Array<{
    name: string;
    path: string;
  }>;
  messages: {
    missing: number;
    translated: number;
  };
  locales: Array<{
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
  }>;
};
