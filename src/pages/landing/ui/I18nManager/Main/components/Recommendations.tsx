import { useTranslations } from 'use-intl';
import { Card, Text, Group, Stack, Button } from '@mantine/core';

type Props = {
  onLearnMoreNaming: () => void;
  onAddDefaultNamespace: () => void;
  recommendations: {
    key: string;
    title: string;
    description: string;
  }[];
};

export const Recommendations = ({
  recommendations,
  onLearnMoreNaming,
  onAddDefaultNamespace,
}: Props) => {
  const t = useTranslations('i18nManager');
  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="sm" fw={600} size="sm">
        {t('recommendations.title')}
      </Text>

      <Stack gap="sm">
        {recommendations.map(rec => (
          <Card withBorder radius="sm" padding="sm" key={rec.key}>
            <Group wrap="nowrap" align="flex-start" justify="space-between">
              <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                <Text fw={500} size="xs">
                  {rec.title}
                </Text>
                <Text size="xs" c="dimmed">
                  {rec.description}
                </Text>
              </Stack>

              {rec.key === 'defaultNamespace' && (
                <Button
                  variant="light"
                  size="compact-xs"

                  onClick={onAddDefaultNamespace}
                >
                  {t('recommendations.add')}
                </Button>
              )}

              {rec.key === 'consistentNaming' && (
                <Button
                  size="compact-xs"
                  variant="default"

                  onClick={onLearnMoreNaming}
                >
                  {t('recommendations.learnMore')}
                </Button>
              )}
            </Group>
          </Card>
        ))}
      </Stack>
    </Card>
  );
};
