import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/notifications/styles.css';
import type { ReactNode } from 'react';
import { IntlProvider } from 'use-intl';
import { DatesProvider } from '@mantine/dates';
import { useState, useLayoutEffect } from 'react';
import { Notifications } from '@mantine/notifications';
import { Loader, Center, MantineProvider, DirectionProvider } from '@mantine/core';

import { loadStores } from '@/shared/lib/tauri';
import { theme } from '@/shared/config/mantine/theme';
import { appStore } from '@/pages/landing/config/store/app';
import allLocalesMessages from '@/shared/config/reactI18n/messages';

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const setProjectsStore = appStore.use.actions().setProjectsStore;

  useLayoutEffect(() => {
    (async () => {
      setIsLoading(true);
      const { projectsStore } = await loadStores();
      setProjectsStore(projectsStore);
      setIsLoading(false);
    })();
  }, []);

  return (
    <IntlProvider
      locale="en"
      messages={allLocalesMessages['en']}

      onError={(error) => {
        throw new Error(error.message);
      }}
    >
      <DatesProvider settings={{ locale: 'en' }}>
        <DirectionProvider>
          <MantineProvider
            theme={theme}
            classNamesPrefix="ICU-Studio"
          >
            <Notifications />

            {isLoading
              ? (
                  <Center h="100dvh">
                    <Loader type="bars" />
                  </Center>
                )
              : children}
          </MantineProvider>
        </DirectionProvider>
      </DatesProvider>
    </IntlProvider>
  );
};

export default Providers;
