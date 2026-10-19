import { useTranslations } from 'use-intl';
import { IconFolderSearch } from '@tabler/icons-react';
// components/empty-states/EmptyProjectsState.tsx
import { Text, Stack, Title, Center, ThemeIcon } from '@mantine/core';

export const EmptyProjectsState = () => {
  const t = useTranslations('i18nManager.emptyState');

  return (
    <Center flex={1} h="100%" mih={400}>
      <Stack gap="md" maw={420} align="center">
        <ThemeIcon size={80} radius="xl" color="blue" variant="light">
          <IconFolderSearch size={40} />
        </ThemeIcon>

        <Stack gap={4} align="center">
          <Title order={3} ta="center">
            {t('noProjects.title')}
          </Title>
          <Text size="sm" c="dimmed" ta="center">
            {t('noProjects.description')}
          </Text>
        </Stack>
      </Stack>
    </Center>
  );
};
