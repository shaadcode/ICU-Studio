import { useTranslations } from 'use-intl';
import { IconFolderOff } from '@tabler/icons-react';
import { Text, Stack, Center, ThemeIcon } from '@mantine/core';

const DetectedStructureEmptyState = () => {
  const t = useTranslations('i18nManager');
  return (
    <Center h={350}>
      <Stack gap="sm" align="center">
        <ThemeIcon size={60} radius="xl" color="gray" variant="light">
          <IconFolderOff size={30} />
        </ThemeIcon>
        <Text size="sm" c="dimmed" ta="center">
          {t('structure.emptyTree')}
        </Text>
      </Stack>
    </Center>
  );
};

export default DetectedStructureEmptyState;
