import './../src/App.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';
import type { Locale } from 'use-intl';
import { IntlProvider } from 'use-intl';
import type { Decorator } from '@storybook/react-vite';
import { Center, MantineProvider, ColorSchemeScript } from '@mantine/core';

import { theme } from '@/shared/config/mantine/theme';
import allLocalesMessages from '@/shared/config/reactI18n/messages';

export const parameters = {
  layout: 'fullscreen',

  a11y: {
    // 'todo' - show a11y violations in the test UI only
    // 'error' - fail CI on a11y violations
    // 'off' - skip a11y checks entirely
    test: 'todo',
  },
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
  (Story, ctx) => {
    const locale = getStorybookLocale(ctx);
    const withoutWrapper = ctx.parameters['withoutWrapper'];
    return (
      <IntlProvider
        locale={locale}
        messages={allLocalesMessages[locale]}

        onError={(error) => {
          throw new Error(error.message);
        }}
      >
        <MantineProvider env="test" theme={theme} forceColorScheme="light">
          <ColorSchemeScript forceColorScheme="light" />
          {withoutWrapper
            ? <Story />
            : (
                <Center
                  p="xl"
                  w="100%"
                >
                  <Story />
                </Center>
              )}
        </MantineProvider>
      </IntlProvider>
    );
  },
] as Array<Decorator>;
