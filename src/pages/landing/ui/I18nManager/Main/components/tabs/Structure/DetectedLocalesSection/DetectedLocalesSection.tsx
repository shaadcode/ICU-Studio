import { useTranslations } from 'use-intl';
import { Box, Card, Text, Badge, Group } from '@mantine/core';

import { AddLocaleModal } from './AddLocaleModal/AddLocaleModal';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const DetectedLocalesSection = (props: Props) => {
  const t = useTranslations('i18nManager');

  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="sm" fw={600} size="sm">
        {t('structure.detectedLocales')}
      </Text>
      <Group gap="xs">
        {props.projectData.locales.map(locale => (
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
        <Box mis="auto">
          <AddLocaleModal projectData={props.projectData} />
        </Box>
      </Group>
    </Card>
  );
};
