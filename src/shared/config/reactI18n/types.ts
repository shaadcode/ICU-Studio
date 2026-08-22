import type enMessages from './messages/en';

declare module 'use-intl' {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface AppConfig {
    Locale: 'en' | 'fa';
    Messages: typeof enMessages;
  }
}
