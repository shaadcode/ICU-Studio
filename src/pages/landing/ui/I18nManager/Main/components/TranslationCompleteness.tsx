import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';
import { Card, Text, Group, Stack, Center, Loader, RingProgress } from '@mantine/core';

import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const TranslationCompleteness = ({ projectData }: Props) => {
  const t = useTranslations('i18nManager');
  const setProjectAnalysis = i18nManagerStore.use.actions().setProjectAnalysis;
  const selectedProjectAnalysis = i18nManagerStore.use.selectedProjectAnalysis();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);

      const patternActions = i18nManagerPatternsActions[projectData.structureType];
      const result = await patternActions.analyze(projectData);
      setProjectAnalysis(result);
      setIsLoading(false);
    };

    run();
  }, [projectData]);

  if (isLoading || !selectedProjectAnalysis) {
    return (
      <Center py="xl">
        <Loader size="sm" type="dots" />
      </Center>
    );
  }

  const { missingKeys, translatedKeys, overallCompletionPercentage } = selectedProjectAnalysis;

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
              {'%'}
            </Text>
          )}
          sections={[
            { color: 'green', value: overallCompletionPercentage, tooltip: `${t('analysis.translated')}: ${translatedKeys.toLocaleString()}` },
            { color: 'yellow', value: 100 - overallCompletionPercentage, tooltip: `${t('analysis.missing')}: ${missingKeys.toLocaleString()}` },
          ]}
        />

        <Stack gap={6} style={{ flex: 1 }}>
          {/* Translated */}
          <Group justify="space-between">
            <Group gap={6}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: 'var(--mantine-color-green-6)',
                }}
              />
              <Text size="xs">{t('analysis.translated')}</Text>
            </Group>
            <Text fw={500} size="xs">
              {translatedKeys.toLocaleString()}
            </Text>
          </Group>

          {/* Missing */}
          <Group justify="space-between">
            <Group gap={6}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: 'var(--mantine-color-yellow-6)',
                }}
              />
              <Text size="xs">{t('analysis.missing')}</Text>
            </Group>
            <Text fw={500} size="xs">
              {missingKeys.toLocaleString()}
            </Text>
          </Group>

          {/* Errors — اگرچه در تابع تحلیل فعلی محاسبه نمی‌شود، برای آینده آماده است */}
          {/* <Group justify="space-between">
            <Group gap={6}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: 'var(--mantine-color-red-6)',
                }}
              />
              <Text size="xs">{t('analysis.errors')}</Text>
            </Group>
            <Text fw={500} size="xs">
              {analysis.errors}
            </Text>
          </Group> */}
        </Stack>
      </Group>
    </Card>
  );
};
