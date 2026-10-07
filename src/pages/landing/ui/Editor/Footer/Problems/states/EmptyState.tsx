import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { IconPencil } from '@tabler/icons-react';
import { Text, Stack, Center, ThemeIcon } from '@mantine/core';

export const EmptyState = memo(() => {
  const tEditor = useTranslations('editor');

  return (
    <Center style={{ flex: 1 }}>
      <Stack gap="sm" maw={280} align="center">
        <ThemeIcon size="lg" radius="xl" color="gray" variant="light">
          <IconPencil size={20} />
        </ThemeIcon>
        <Text size="sm" c="dimmed" ta="center">
          {tEditor('widgets.problems.emptyHint')}
        </Text>
      </Stack>
    </Center>
  );
});

EmptyState.displayName = 'EmptyState';
