import { useTranslations } from 'use-intl';
import { IconFolderOff } from '@tabler/icons-react';
import { Text, Stack, Center, ThemeIcon } from '@mantine/core';

import { RecentScans } from '../Main/components/RecentScans';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { QuickActions } from '../Main/components/QuickActions/QuickActions';
import { TranslationCompleteness } from '../Main/components/TranslationCompleteness';

const I18nManagerSidebar = () => {
  const t = useTranslations('i18nManager');
  const selectedProject = i18nManagerStore.use.selectedProject();
  const selectedProjectData = i18nManagerStore.use.selectedProjectData();

  if (!selectedProject || !selectedProjectData) {
    return (
      <Center p="md" h="100%">
        <Stack gap="sm" align="center">
          <ThemeIcon size={50} radius="xl" color="gray" variant="light">
            <IconFolderOff size={26} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" ta="center">
            {t('emptyState.noSelection.title')}
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack p="md">
      <TranslationCompleteness projectData={selectedProjectData} />

      <QuickActions
        projectData={selectedProjectData}
      />
      <RecentScans project={selectedProject} projectData={selectedProjectData} />
    </Stack>
  );
};

export default I18nManagerSidebar;
