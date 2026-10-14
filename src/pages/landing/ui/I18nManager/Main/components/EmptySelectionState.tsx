import { useTranslations } from 'use-intl';
import { IconFolderOff } from '@tabler/icons-react';
// components/empty-states/EmptySelectionState.tsx
import { Text, Stack, Title, Center, ThemeIcon } from '@mantine/core';

export const EmptySelectionState = () => {
  const t = useTranslations('i18nManager.emptyState');

  return (
    <Center h="100%" mih={400}>
      <Stack gap="md" maw={420} align="center">
        <ThemeIcon size={80} radius="xl" color="gray" variant="light">
          <IconFolderOff size={40} />
        </ThemeIcon>

        <Stack gap={4} align="center">
          <Title order={3} ta="center">
            {t('noSelection.title')}
          </Title>
          <Text size="sm" c="dimmed" ta="center">
            {t('noSelection.description')}
          </Text>
        </Stack>
      </Stack>
    </Center>
  );
};
