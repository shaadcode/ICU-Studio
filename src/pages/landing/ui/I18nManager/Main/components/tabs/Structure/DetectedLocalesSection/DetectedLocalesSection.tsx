import { useTranslations } from 'use-intl';
import { IconFolderOff } from '@tabler/icons-react';
import { Box, Card, Text, Badge, Group, Stack, Center, ThemeIcon } from '@mantine/core';

import { AddLocaleModal } from './AddLocaleModal/AddLocaleModal';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const DetectedLocalesSection = (props: Props) => {
  const t = useTranslations('i18nManager');
  const isEmpty = props.projectData.locales.length === 0;

  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="sm" fw={600} size="sm">
        {t('structure.detectedLocales')}
      </Text>

      {isEmpty
        ? (
            <Center py="md">
              <Stack gap="sm" align="center">
                <ThemeIcon size={50} radius="xl" color="gray" variant="light">
                  <IconFolderOff size={26} />
                </ThemeIcon>
                <Text size="sm" c="dimmed" ta="center">
                  {t('structure.emptyLocales')}
                </Text>
                <AddLocaleModal projectData={props.projectData} />
              </Stack>
            </Center>
          )
        : (
            <Group gap="xs">
              {props.projectData.locales.map(locale => (
                <Badge
                  size="lg"
                  radius="sm"
                  color="blue"
                  variant="light"
                  key={locale.language.code}
                >
                  {locale.language.code}
                </Badge>
              ))}
              <Box mis="auto">
                <AddLocaleModal projectData={props.projectData} />
              </Box>
            </Group>
          )}
    </Card>
  );
};
