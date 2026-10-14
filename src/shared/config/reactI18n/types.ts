import type { Paths } from 'type-fest';
import type { Messages, useTranslations } from 'use-intl';

import type enMessages from './messages/en';

declare module 'use-intl' {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface AppConfig {
    Locale: 'en' | 'fa';
    Messages: typeof enMessages;
  }
}

export type Translator<Base extends Paths<Messages>> = ReturnType<
  // @ts-expect-error
    typeof useTranslations<Base>
>;
