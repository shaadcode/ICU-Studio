import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
import type { Locale } from 'use-intl';
import { IntlProvider } from 'use-intl';
import { Center, MantineProvider, ColorSchemeScript } from '@mantine/core';

import { theme } from '@/shared/config/mantine/theme';
import allLocalesMessages from '@/shared/config/reactI18n/messages';

export const parameters = {
  layout: 'fullscreen',
} as const;

const getStorybookLocale = (ctx?: any) => ctx?.globals?.locale as Locale
  ?? 'en';

export const globalTypes = {
  locale: {
    toolbar: {
      icon: 'globe',
      items: [
        // {
        //   value: 'fa',
        //   title: 'فارسی',
        // },
        {
          value: 'en',
          title: 'English',
        },
      ],
    },
  },
  // theme: {
  //   name: 'Theme',
  //   defaultValue: 'light',
  //   description: 'Mantine color scheme',
  //   toolbar: {
  //     icon: 'mirror',
  //     items: [
  //       { value: 'light', title: 'Light' },
  //       { value: 'dark', title: 'Dark' },
  //     ],
  //   },
  // },
} as const;

export const initialGlobals = {
  locale: getStorybookLocale(),
} as const;
export const decorators = [
  (Story: any, ctx: any) => {
    const locale = getStorybookLocale(ctx);

    return (
      <IntlProvider
        locale="en"
        messages={allLocalesMessages[locale]}

        onError={(error) => {
          throw new Error(error.message);
        }}
      >
        <MantineProvider theme={theme}>
          <ColorSchemeScript />
          <Center p="xl" w="100%">
            <Story />
          </Center>
        </MantineProvider>
      </IntlProvider>
    );
  },
];
