import { useTranslations } from 'use-intl';
import { IconLanguage } from '@tabler/icons-react';
import { Box, Text, Stack, Button, Center, ThemeIcon } from '@mantine/core';

export const EmptyBaseLocaleState = () => {
  const t = useTranslations('i18nManager');

  return (
    <Box flex={1}>
      <Center h="100%">
        <Stack gap="md" maw={420} align="center">
          <ThemeIcon size={64} radius="xl" color="blue" variant="light">
            <IconLanguage size={32} />
          </ThemeIcon>

          <Text fw={600} size="lg" ta="center">
            {t('emptyBaseLocale.title')}
          </Text>

          <Text size="sm" c="dimmed" ta="center">
            {t('emptyBaseLocale.description')}
          </Text>

          <Button
            size="md"

            onClick={() => {
              // TODO: مسیر رفتن به تنظیمات انتخاب baseLocale
              // مثلاً: navigate('/i18n-manager/settings')
            }}
          >
            {t('emptyBaseLocale.selectAction')}
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};
