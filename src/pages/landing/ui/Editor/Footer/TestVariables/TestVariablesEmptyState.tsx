// src/.../TestVariables/TestVariablesEmptyState.tsx
import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { IconVariableOff } from '@tabler/icons-react';
import { Text, Stack, Center, ThemeIcon } from '@mantine/core';

export const TestVariablesEmptyState = memo(() => {
  const t = useTranslations('editor');

  return (
    <Center h="100%">
      <Stack
        h="100%"
        gap="xs"
        maw={260}
        align="center"
        justify="center"
      >
        <ThemeIcon size="lg" radius="xl" color="gray" variant="light">
          <IconVariableOff size={20} />
        </ThemeIcon>
        <Text size="sm" c="dimmed" ta="center">
          {t('widgets.testVariables.empty.title')}
        </Text>
        <Text size="xs" c="dimmed" ta="center">
          {t('widgets.testVariables.empty.hint')}
        </Text>
      </Stack>
    </Center>
  );
});

TestVariablesEmptyState.displayName = 'TestVariablesEmptyState';
