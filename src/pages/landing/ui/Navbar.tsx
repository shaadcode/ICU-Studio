import { useTranslations } from 'use-intl';
import { Grid, Stack, GridCol, Tooltip, ActionIcon } from '@mantine/core';
import { IconPencil, IconFolders, IconMessage2 } from '@tabler/icons-react';

import { appStore } from '../config/store/app';
import MessagesNavbar from './Messages/Navbar/Messages';
import { icuEditorStore } from '../config/store/editor';
import I18nManagerNavbar from './I18nManager/Navbar/Navbar';
import type { ViewTabsItems } from '../config/store/app/configSlice';

const Navbar = () => {
  const setView = appStore.use.actions().setView;
  const clearEditorStore = icuEditorStore.use.actions().clearStore;
  const view = appStore.use.view();
  const t = useTranslations('common');

  const navItems = [
    {
      value: 'editor',
      icon: IconPencil,
      label: t('editor'),
    },
    {
      value: 'messages',
      icon: IconMessage2,
      label: t('messages', { count: 2 }),
    },
    {
      icon: IconFolders,
      value: 'i18nManager',
      label: t('project', { count: 2 }),
    },
  ] as const satisfies Array<{
    icon: any;
    label: string;
    value: ViewTabsItems;
  }>;

  return (
    <Grid p="md" w="100%" styles={{ inner: { flexWrap: 'nowrap' } }}>
      <GridCol span={2}>
        <Stack justify="center">
          {navItems.map(item => (
            <Tooltip
              fz={10}
              tt="capitalize"
              position="right"
              key={item.label}
              label={item.label}
            >
              <ActionIcon
                size="lg"
                bd="none"
                color="green"
                variant={item.value === view ? 'filled' : 'default'}

                onClick={() => {
                  setView(item.value);
                  clearEditorStore();
                }}
              >
                <item.icon size="60%" />
              </ActionIcon>
            </Tooltip>
          ))}
        </Stack>
      </GridCol>
      <GridCol span={10}>
        {view === 'messages' && <MessagesNavbar />}
        {view === 'i18nManager' && <I18nManagerNavbar />}
      </GridCol>
    </Grid>
  );
};

export default Navbar;
