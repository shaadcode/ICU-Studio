import type { useTranslations } from 'use-intl';

import type enMessages from './messages/en';

declare module 'use-intl' {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface AppConfig {
    Locale: 'en' | 'fa';
    Messages: typeof enMessages;
  }
}

export type CommonTranslator = ReturnType<typeof useTranslations<'common'>>;
export type EditorTranslator = ReturnType<typeof useTranslations<'editor'>>;
export type I18nManagerTranslator = ReturnType<typeof useTranslations<'i18nManager'>>;
