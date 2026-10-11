// OutlineEmptyState.tsx
import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { IconListTree } from '@tabler/icons-react';
import { Text, Stack, Center, ThemeIcon } from '@mantine/core';

export const OutlineEmptyState = memo(() => {
  const t = useTranslations('editor');

  return (
    <Center mih={160} style={{ flex: 1 }}>
      <Stack gap="xs" maw={240} align="center">
        <ThemeIcon size="lg" radius="xl" color="gray" variant="light">
          <IconListTree size={20} />
        </ThemeIcon>
        <Text size="sm" c="dimmed" ta="center">
          {t('widgets.outline.empty.title')}
        </Text>
        <Text size="xs" c="dimmed" ta="center">
          {t('widgets.outline.empty.hint')}
        </Text>
      </Stack>
    </Center>
  );
});

OutlineEmptyState.displayName = 'OutlineEmptyState';
