import { useState } from 'react';
import { IconRefresh } from '@tabler/icons-react';
import { Box, Card, Text, Group, Button } from '@mantine/core';
import { useNow, useFormatter, useTranslations } from 'use-intl';

import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  project: NonNullable<I18nManagerStore['selectedProject']>;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const RecentScans = (params: Props) => {
  const t = useTranslations('i18nManager');
  const format = useFormatter();
  const setSelectedProjectData = i18nManagerStore.use.actions().setSelectedProjectData;
  const setProjectAnalysis = i18nManagerStore.use.actions().setProjectAnalysis;
  const now = useNow({ updateInterval: 1000 * 30 });
  const [isLoading, setIsLoading] = useState(false);

  const handleRescan = async () => {
    setIsLoading(true);
    const patternActions = i18nManagerPatternsActions[params.projectData.structureType];
    // @ts-expect-error
    const { data } = await patternActions.getProjectData({
      setProjectAnalysis,
      project: params.project,
      onWatch: patternActions.handleWatch,
    });
    setSelectedProjectData(data);
    setIsLoading(false);
  };

  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="sm" fw={600} size="sm">
        {t('recentScans.title')}
      </Text>

      <Group justify="space-between">
        <Group gap="xs" wrap="nowrap">
          <Box w={7} h={7} bdrs={999} bg="green" />
          <Text size="xs" c="dimmed">
            {t(
              'recentScans.lastScan',
              { time: format.relativeTime(params.projectData.recentScan, now) },
            )}
          </Text>
        </Group>

        <Button
          size="compact-xs"
          variant="default"
          loading={isLoading}
          leftSection={<IconRefresh size={12} />}

          onClick={handleRescan}
        >
          {t('recentScans.rescan')}
        </Button>
      </Group>
    </Card>
  );
};
