import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { IconWand } from '@tabler/icons-react';
import { Text, Stack, Center, ThemeIcon } from '@mantine/core';

export const UnformattedState = memo(() => {
  const t = useTranslations('editor');

  return (
    <Center h="100%" style={{ flex: 1 }}>
      <Stack gap="sm" maw={280} align="center">
        <ThemeIcon size="lg" radius="xl" color="blue" variant="light">
          <IconWand size={20} />
        </ThemeIcon>
        <Text size="sm" c="dimmed" ta="center">
          {t('widgets.statistics.unformattedHint')}
        </Text>
      </Stack>
    </Center>
  );
});

UnformattedState.displayName = 'UnformattedState';
