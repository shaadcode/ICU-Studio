import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import { Text, Stack, Center, ThemeIcon } from '@mantine/core';

export const ValidState = memo(() => {
  const tEditor = useTranslations('editor');

  return (
    <Center style={{ flex: 1 }}>
      <Stack gap="xs" align="center">
        <ThemeIcon size="lg" radius="xl" color="green" variant="light">
          <IconCircleCheckFilled size={20} />
        </ThemeIcon>
        <Text size="sm" c="dimmed" ta="center" textWrap="wrap">
          {tEditor('widgets.problems.noProblems')}
        </Text>
      </Stack>
    </Center>
  );
});

ValidState.displayName = 'ValidState';
