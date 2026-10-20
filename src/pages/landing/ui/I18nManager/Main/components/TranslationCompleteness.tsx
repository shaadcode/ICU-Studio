import { useTranslations } from 'use-intl';
import { IconInfoCircle } from '@tabler/icons-react';
import { Box, Card, Text, Group, Stack, Alert, Center, Loader, RingProgress } from '@mantine/core';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const TranslationCompleteness = (_props: Props) => {
  const t = useTranslations('i18nManager');
  const isAnalyzing = i18nManagerStore.use.isAnalyzing();
  const selectedProjectAnalysis = i18nManagerStore.use.selectedProjectAnalysis();

  if (isAnalyzing) {
    return (
      <Center py="xl">
        <Loader size="sm" type="dots" />
      </Center>
    );
  }

  if (!selectedProjectAnalysis) {
    return (
      <Card withBorder radius="md" padding="md">
        <Alert
          color="blue"
          variant="light"
          icon={<IconInfoCircle size={16} />}
          title={t('analysis.noAnalysisTitle')}
        >
          <Text size="sm">
            {t('analysis.noAnalysisMessage')}
          </Text>
        </Alert>
      </Card>
    );
  }

  const { missingKeys, translatedKeys, overallCompletionPercentage } = selectedProjectAnalysis;

  const data = [
    {
      color: 'green',
      value: translatedKeys,
      label: t('analysis.translated'),
      percentage: overallCompletionPercentage,
    },
    {
      color: 'yellow',
      value: missingKeys,
      label: t('analysis.missing'),
      percentage: 100 - overallCompletionPercentage,
    },
  ] as const;

  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="md" fw={600} size="sm">
        {t('analysis.title')}
      </Text>

      <Group gap="md" wrap="nowrap">
        <RingProgress
          size={80}
          thickness={8}
          label={(
            <Text fw={600} size="sm" ta="center">
              {overallCompletionPercentage}
              {'%\r'}
            </Text>
          )}
          sections={data.map(({ color, label, value, percentage }) => ({
            color,
            value: percentage,
            tooltip: `${label}: ${value.toLocaleString()}`,
          }))}
        />

        <Stack gap={6} style={{ flex: 1 }}>
          {data.map(({ label, value, color }) => (
            <Group key={label} justify="space-between">
              <Group gap={6}>
                <Box w={8} h={8} bg={color} bdrs={999} />
                <Text size="xs">{label}</Text>
              </Group>
              <Text fw={500} size="xs">
                {value.toLocaleString()}
              </Text>
            </Group>
          ))}
        </Stack>
      </Group>
    </Card>
  );
};
