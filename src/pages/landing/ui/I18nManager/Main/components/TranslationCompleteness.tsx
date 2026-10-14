import { useTranslations } from 'use-intl';
import { Card, Text, Group, Stack } from '@mantine/core';

type Props = {
  analysis: {
    missing: number;
    translated: number;
  };
};

export const TranslationCompleteness = ({ analysis }: Props) => {
  const t = useTranslations('i18nManager');
  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="md" fw={600} size="sm">
        {t('analysis.title')}
      </Text>

      <Group gap="md" wrap="nowrap">
        {/* <RingProgress
          size={90}
          roundCaps
          thickness={8}
          sections={[{ color: 'green', value: analysis.percent }]}
          label={(
            <Text fw={600} size="sm" ta="center">
              {analysis.percent}
              {'%\r'}
            </Text>
          )}
        /> */}

        <Stack gap={6} style={{ flex: 1 }}>
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
              {analysis.translated}
            </Text>
          </Group>

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
              {analysis.missing}
            </Text>
          </Group>

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
