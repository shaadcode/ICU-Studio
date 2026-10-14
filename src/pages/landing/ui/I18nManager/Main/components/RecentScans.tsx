import { useTranslations } from 'use-intl';
import { IconRefresh } from '@tabler/icons-react';
import { Card, Text, Group, Button } from '@mantine/core';

type Props = {
  onRescan: () => void;
  recentScan: { lastScanAt: string };
};

export const RecentScans = ({ onRescan, recentScan }: Props) => {
  const t = useTranslations('i18nManager');
  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="sm" fw={600} size="sm">
        {t('recentScans.title')}
      </Text>

      <Group justify="space-between">
        <Text size="xs" c="dimmed">
          {t('recentScans.lastScan', { time: recentScan.lastScanAt })}
        </Text>
        <Button
          size="compact-xs"
          variant="default"
          leftSection={<IconRefresh size={12} />}

          onClick={onRescan}
        >
          {t('recentScans.rescan')}
        </Button>
      </Group>
    </Card>
  );
};
