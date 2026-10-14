import { useTranslations } from 'use-intl';
import { IconCircleCheck } from '@tabler/icons-react';
import { Card, Text, Group, ThemeIcon } from '@mantine/core';

type Props = {
  insights: { message: string };
};

export const StructureInsights = ({ insights }: Props) => {
  const t = useTranslations('i18nManager');

  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="sm" fw={600} size="sm">
        {t('insights.title')}
      </Text>

      <Group gap="xs" wrap="nowrap">
        <ThemeIcon size={20} radius="xl" color="green" variant="light">
          <IconCircleCheck size={12} />
        </ThemeIcon>
        <Text size="sm">{insights.message}</Text>
      </Group>
    </Card>
  );
};
