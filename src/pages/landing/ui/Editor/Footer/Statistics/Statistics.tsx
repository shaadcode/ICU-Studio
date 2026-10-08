import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { IconMessage, IconChartPie } from '@tabler/icons-react';
import { Box, Text, Group, Paper, Stack, RingProgress } from '@mantine/core';

import { StatCard } from './StatCard';
import WidgetHeader from '../../WidgetHeader';
import { MessageDetails } from './MessageDetails';
import { donutData, projectStats } from './statistics.mock';
import WidgetContainer from '../../WidgetContainer/WidgetContainer';

export const StatisticsWidget = memo(() => {
  const t = useTranslations('editor');

  const ringSections = donutData.map(item => ({
    value: item.value,
    color: item.color,
    tooltip: item.label,
  }));

  return (
    <WidgetContainer>
      <Stack gap="sm">
        <WidgetHeader
          label={t('widgets.statistics.title')}
          icon={props => <IconChartPie color="var(--mantine-color-blue-6)" {...props} />}
        />

        {/* Stat cards */}
        <Group grow gap="xs" wrap="nowrap" align="stretch">
          <StatCard
            value={projectStats.totalMessages}
            label={t('widgets.statistics.project.totalMessages')}
          />
          <StatCard
            value={projectStats.withVariables.count}
            hint={`${projectStats.withVariables.percent}%`}
            label={t('widgets.statistics.project.withVariables')}
          />
          <StatCard
            value={projectStats.withPlural.count}
            hint={`${projectStats.withPlural.percent}%`}
            label={t('widgets.statistics.project.withPlural')}
          />
          <StatCard
            value={projectStats.withSelect.count}
            hint={`${projectStats.withSelect.percent}%`}
            label={t('widgets.statistics.project.withSelect')}
          />
        </Group>

        {/* Current Message */}
        <Paper p="sm" withBorder radius="md">
          <Stack gap="md">
            <Group gap="xs" wrap="nowrap">
              <IconMessage size={16} />
              <Text fw={600} size="sm">
                {t('widgets.statistics.currentMessage')}
              </Text>
            </Group>

            <Group gap="xl" wrap="nowrap" align="center">
              {/* RingProgress */}
              <Box style={{ flexShrink: 0 }}>
                <RingProgress
                  size={160}
                  thickness={28}
                  sections={ringSections}
                  label={(
                    <Text fw={700} size="lg" ta="center">
                      {projectStats.totalMessages}
                    </Text>
                  )}
                />
              </Box>

              {/* Legend */}
              <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
                {donutData.map(item => (
                  <Group gap="xs" wrap="nowrap" key={item.label}>
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
                      {'%\r'}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Group>

            {/* Divider */}
            <Box
              style={{
                borderTop: '1px solid var(--mantine-color-gray-2)',
              }}
            />

            {/* Message Details */}
            <MessageDetails />
          </Stack>
        </Paper>
      </Stack>
    </WidgetContainer>
  );
});

StatisticsWidget.displayName = 'StatisticsWidget';
