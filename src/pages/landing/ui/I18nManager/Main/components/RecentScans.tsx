import { IconRefresh } from '@tabler/icons-react';
import { Card, Text, Group, Button } from '@mantine/core';
import { useNow, useFormatter, useTranslations } from 'use-intl';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const RecentScans = (params: Props) => {
  const t = useTranslations('i18nManager');
  const format = useFormatter();
  const now = useNow({ updateInterval: 1000 * 30 });

  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="sm" fw={600} size="sm">
        {t('recentScans.title')}
      </Text>

      <Group justify="space-between">
        <Text size="xs" c="dimmed">
          {t(
            'recentScans.lastScan',
            { time: format.relativeTime(params.projectData.recentScan, now) },
          )}
        </Text>
        <Button
          size="compact-xs"
          variant="default"
          leftSection={<IconRefresh size={12} />}
        >
          {t('recentScans.rescan')}
        </Button>
      </Group>
    </Card>
  );
};
