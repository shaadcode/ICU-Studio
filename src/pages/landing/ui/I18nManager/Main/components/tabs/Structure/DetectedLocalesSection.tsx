import { useTranslations } from 'use-intl';
import { IconPlus } from '@tabler/icons-react';
import { Card, Text, Badge, Group, Button } from '@mantine/core';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  onAddLocale: () => void;
  locales: NonNullable<I18nManagerStore['selectedProjectData']>['locales'];
};

export const DetectedLocalesSection = ({ locales, onAddLocale }: Props) => {
  const t = useTranslations('i18nManager');
  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="sm" fw={600} size="sm">
        {t('structure.detectedLocales')}
      </Text>
      <Group gap="xs">
        {locales.map(locale => (
          <Badge
            size="lg"
            radius="sm"
            color="blue"
            key={locale}
            variant="light"
          >
            {locale}
          </Badge>
        ))}
        <Button
          size="xs"
          variant="default"
          leftSection={<IconPlus size={12} />}
          styles={{ root: { borderStyle: 'dashed' } }}

          onClick={onAddLocale}
        >
          {t('structure.addLocale')}
        </Button>
      </Group>
    </Card>
  );
};
