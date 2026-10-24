import { attemptAsync } from 'es-toolkit';
import { useTranslations } from 'use-intl';
import { IconFolderOpen } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { revealItemInDir } from '@tauri-apps/plugin-opener';
import { Card, Text, Stack, Group, Paper, ThemeIcon } from '@mantine/core';

import classes from './QuickActions.module.css';
import type { BaseProjectInfo } from '../../../Navbar/CreateNewProject/types';

const icons = {
  // download: IconDownload,
  explorer: IconFolderOpen,
  // convert: IconFileArrowRight,
};
type Props = {
  project: BaseProjectInfo;
};
export const QuickActions = (props: Props) => {
  const t = useTranslations('i18nManager');

  const actions = [
    // {
    //   icon: 'download',
    //   key: 'exportReport',
    //   title: t('quickActions.exportReport.title'),
    //   description: t('quickActions.exportReport.description'),
    // },
    // {
    //   icon: 'convert',
    //   key: 'convertCsv',
    //   title: t('quickActions.convertCsv.title'),
    //   description: t('quickActions.convertCsv.description'),
    // },
    {
      icon: 'explorer',
      key: 'openExplorer',
      title: t('quickActions.openExplorer.title'),
      description: t('quickActions.openExplorer.description'),
      async action() {
        const [error] = await attemptAsync(async () => {
          await revealItemInDir(props.project.path);
        });

        if (error) {
          notifications.show({
            color: 'red',
            title: t('structure.notifications.revealFailed.title'),
            message: error instanceof Error ? error.message : String(error),
          });
        }
      },
    },
  ];

  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="sm" fw={600} size="sm">
        {t('quickActions.title')}
      </Text>

      <Stack gap={4}>
        {actions.map((action) => {
          const Icon = icons[action.icon as keyof typeof icons];
          return (
            <Paper
              withBorder
              key={action.key}
              className={classes['quick-action-item']}

              onClick={action.action}
            >
              <Group p="xs" gap="sm" wrap="nowrap">
                <ThemeIcon size={35} color="blue" variant="light">
                  <Icon size="70%" />

                </ThemeIcon>
                <Stack gap={0}>
                  <Text fw={500} size="xs">
                    {action.title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {action.description}
                  </Text>
                </Stack>
              </Group>
            </Paper>
          );
        })}
      </Stack>
    </Card>
  );
};
