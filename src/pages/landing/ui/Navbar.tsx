import { useTranslations } from 'use-intl';
import { IconFolders, IconMessage2 } from '@tabler/icons-react';
import { Grid, Stack, GridCol, Tooltip, ActionIcon } from '@mantine/core';

import { appStore } from '../config/store/app';
import MessagesNavbar from './Messages/Navbar/Messages';
import type { ViewTabsItems } from './Projects/Header/Header';
import type { MessageKeys } from '@/shared/config/reactI18n/types';

const navItems = [
  {
    value: 'messages',
    label: 'messages',
    icon: IconMessage2,
  },
  {
    value: 'projects',
    label: 'projects',
    icon: IconFolders,
  },
] as const satisfies Array<{
  icon: any;
  value: ViewTabsItems;
  label: MessageKeys<'editor'>;
}>;

const Navbar = () => {
  const setView = appStore.use.actions().setView;
  const view = appStore.use.view();
  const t = useTranslations('editor');
  return (
    <Grid p="md" w="100%">
      <GridCol span={2}>
        <Stack justify="center">
          {navItems.map(item => (
            <Tooltip key={item.label} label={t(item.label)}>
              <ActionIcon
                size="lg"
                bd="none"
                color="green"
                variant={item.value === view ? 'filled' : 'default'}

                onClick={() => setView(item.value)}
              >
                <item.icon size="60%" />
              </ActionIcon>
            </Tooltip>
          ))}
        </Stack>
      </GridCol>
      <GridCol span={10}>
        {view === 'messages' && <MessagesNavbar />}
      </GridCol>
    </Grid>
  );
};

export default Navbar;
