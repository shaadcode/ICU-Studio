import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { IconChartPieOff } from '@tabler/icons-react';
import { Text, Stack, Center, ThemeIcon } from '@mantine/core';

export const StatisticsEmptyState = memo(() => {
  const t = useTranslations('editor');

  return (
    <Center mih={200} style={{ flex: 1 }}>
      <Stack gap="xs" maw={260} align="center">
        <ThemeIcon size="lg" radius="xl" color="gray" variant="light">
          <IconChartPieOff size={20} />
        </ThemeIcon>
        <Text size="sm" c="dimmed" ta="center">
          {t('widgets.statistics.empty.title')}
        </Text>
        <Text size="xs" c="dimmed" ta="center">
          {t('widgets.statistics.empty.hint')}
        </Text>
      </Stack>
    </Center>
  );
});

StatisticsEmptyState.displayName = 'StatisticsEmptyState';
