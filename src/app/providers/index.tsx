import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/notifications/styles.css';
import type { ReactNode } from 'react';
import { IntlProvider } from 'use-intl';
import { MantineProvider, DirectionProvider, ColorSchemeScript } from '@mantine/core';

import { theme } from '@/shared/config/mantine/theme';
import allLocalesMessages from '@/shared/config/reactI18n/messages';

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <IntlProvider
      locale="en"
      messages={allLocalesMessages['en']}

      onError={(error) => {
        throw new Error(error.message);
      }}
    >
      <DirectionProvider>
        <MantineProvider theme={theme}>
          <ColorSchemeScript />
          {children}
        </MantineProvider>
      </DirectionProvider>
    </IntlProvider>
  );
};

export default Providers;
