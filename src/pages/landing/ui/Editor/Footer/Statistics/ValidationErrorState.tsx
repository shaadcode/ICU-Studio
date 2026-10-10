import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Text, Stack, Center, ThemeIcon } from '@mantine/core';

export const ValidationErrorState = memo(() => {
  const t = useTranslations('editor');

  return (
    <Center style={{ flex: 1 }}>
      <Stack gap="sm" maw={280} align="center">
        <ThemeIcon size="lg" radius="xl" color="red" variant="light">
          <IconAlertTriangle size={20} />
        </ThemeIcon>
        <Text size="sm" c="dimmed" ta="center">
          {t('widgets.statistics.validationErrorHint')}
        </Text>
      </Stack>
    </Center>
  );
});

ValidationErrorState.displayName = 'ValidationErrorState';
