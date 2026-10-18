import ISO6391 from 'iso-639-1';
import { isString } from 'es-toolkit';
import type { LanguageCode } from 'iso-639-1';
import type { LiteralUnion } from 'type-fest';
import { countries, languages } from 'countries-list';
import type { ICountry, ILanguage, TCountryCode, TLanguageCode } from 'countries-list';

import type { ErrorKindName, MessageElementsTypeEnum, MessageElementsTypeKeyword } from './types';

export const BOUNCE_UPDATE_VARIABLE_VALUE = 300;

export const formatMessageElementsKeywordByEnum = {
  8: 'tag',
  3: 'date',
  4: 'time',
  7: 'pound',
  2: 'number',
  5: 'select',
  6: 'plural',
  0: 'literal',
  1: 'argument',
} as Record<MessageElementsTypeEnum, MessageElementsTypeKeyword>;

export const formatMessageElementsEnumByKeyword = {
  tag: 8,
  date: 3,
  time: 4,
  pound: 7,
  number: 2,
  select: 5,
  plural: 6,
  literal: 0,
  argument: 1,
} as Record<MessageElementsTypeKeyword, MessageElementsTypeEnum>;

export const warningErrors: Partial<Record<ErrorKindName, ErrorKindName>> = {
  CONFLICT_VARIABLE_NAME: 'CONFLICT_VARIABLE_NAME',
};

export const ICU_STUDIO_WEBSITE = 'https://shaadcode.github.io/icu-studio-docs';

export type LocaleInfo = {
  country: ICountry;
  region: TCountryCode;
  languageData: ILanguage;
  languageCode: TLanguageCode;
};

export const localeInfoMap = (() => {
  const langs = ISO6391.getAllCodes();
  const result: Partial<Record<LanguageCode, LocaleInfo>> = {};

  for (const lang of langs) {
    const parsedLocale = parseLocale(lang);

    if (!parsedLocale.region || !parsedLocale.language) {
      continue;
    }

    const country = countries[parsedLocale.region as keyof typeof countries];
    const languageData
      = languages[parsedLocale.language as keyof typeof languages];

    if (!country || !languageData) {
      continue;
    }

    result[lang] = {
      country,
      languageData,
      region: parsedLocale.region,
      languageCode: parsedLocale.language,
    };
  }

  return result;
})();

export function parseLocale(
  localeCode: LiteralUnion<LanguageCode, string>,
) {
  const [locale, region] = localeCode.split('-');
  if (!locale) {
    return { region: undefined, language: undefined };
  }
  try {
    const localeInstance = new Intl.Locale(localeCode);
    const minimizeLocale = localeInstance.minimize();

    const info = isString(region) && minimizeLocale?.region === region
      ? minimizeLocale
      : localeInstance.maximize();

    return {
      region: info.region as TCountryCode,
      language: info.language as TLanguageCode,
    };
  } catch {
    return { region: undefined, language: undefined };
  }
}
