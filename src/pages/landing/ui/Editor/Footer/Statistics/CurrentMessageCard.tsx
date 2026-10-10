import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { IconMessage } from '@tabler/icons-react';
import { Box, Text, Group, Paper, Stack, Divider, RingProgress } from '@mantine/core';

import { MessageDetails } from './MessageDetails';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

export const CurrentMessageCard = memo(() => {
  const stats = icuEditorStore.use.stats();
  const t = useTranslations('editor');

  const ringSections = [
    {
      value: stats.textRatio,
      color: 'var(--mantine-color-blue-6)',
      tooltip: t('widgets.statistics.legend.text'),
    },
    {
      value: stats.icuSyntaxRatio,
      color: 'var(--mantine-color-grape-6)',
      tooltip: t('widgets.statistics.legend.syntax'),
    },
  ];

  const legendItems = [
    {
      key: 'text',
      value: stats.textRatio,
      color: 'var(--mantine-color-blue-6)',
      label: t('widgets.statistics.legend.text'),
    },
    {
      key: 'syntax',
      value: stats.icuSyntaxRatio,
      color: 'var(--mantine-color-grape-6)',
      label: t('widgets.statistics.legend.syntax'),
    },
  ];

  return (
    <Paper p="sm" withBorder radius="md">
      <Stack gap="xs">
        <Group gap="xs" wrap="nowrap">
          <IconMessage size={16} />
          <Text fw={600} size="sm">
            {t('widgets.statistics.currentMessage')}
          </Text>
        </Group>

        <Group wrap="nowrap" align="center">
          <Box style={{ flexShrink: 0 }}>
            <RingProgress
              size={100}
              thickness={15}
              sections={ringSections}
              label={(
                <Text fw={700} size="lg" ta="center">
                  {stats.characters}
                </Text>
              )}
            />
          </Box>

          <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
            {legendItems.map(item => (
              <Group gap="xs" wrap="nowrap" key={item.key}>
                <Box
                  w={8}
                  h={8}
                  style={{
                    flexShrink: 0,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                  }}
                />
                <Text size="sm" style={{ flex: 1 }}>
                  {item.label}
                </Text>
                <Text size="sm" c="dimmed">
                  {item.value}
                  {'%'}
                </Text>
              </Group>
            ))}
          </Stack>
        </Group>

        <Divider />

        <MessageDetails stats={stats} />
      </Stack>
    </Paper>
  );
});

CurrentMessageCard.displayName = 'CurrentMessageCard';
