import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { IconMessageOff } from '@tabler/icons-react';
import {
  Text,
  Group,
  Stack,
  Center,
  Loader,
  ThemeIcon,
} from '@mantine/core';

import { ProjectItem } from './ProjectItem';
import { storeKeys } from '@/shared/config/tauri';
import type { BaseProjectInfo } from './CreateNewProject/types';
import { CreateNewProject } from './CreateNewProject/CreateNewProject';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

const I18nManagerNavbar = () => {
  const t = useTranslations('i18nManager');
  const [isLoading, setIsLoading] = useState(true);

  const setI18nManagerStore = i18nManagerStore.use.actions().setI18nManagerStore;
  const setProjects = i18nManagerStore.use.actions().setProjects;
  const projects = i18nManagerStore.use.projects();

  useEffect(() => {
    (async () => {
      const store = await load('i18nManager.json', { autoSave: false });
      setI18nManagerStore(store);

      const savedProjects
        = (await store.get<BaseProjectInfo[]>(storeKeys.i18nManager.projects))
          ?? [];

      setProjects(savedProjects);
      setIsLoading(false);
    })();
  }, [setI18nManagerStore]);

  return (
    <Stack>
      <Group wrap="nowrap" justify="space-between">
        <Text fw={600} tt="capitalize">
          {t('project', { count: 2 })}
        </Text>
        <CreateNewProject />
      </Group>

      {isLoading
        ? (
            <Center py="xl">
              <Stack gap="xs" align="center">
                <Loader size="sm" />
                <Text fz="xs" c="dimmed" ta="center">
                  {t('loadingState')}
                </Text>
              </Stack>
            </Center>
          )
        : projects.length === 0
          ? (
              <Center py="xl" w="100%">
                <Stack gap="xs" align="center">
                  <ThemeIcon size={50} radius="xl" color="gray" variant="light">
                    <IconMessageOff size="60%" stroke={1.5} />
                  </ThemeIcon>
                  <Text fz="sm" fw={600} ta="center" style={{ userSelect: 'none' }}>
                    {t('emptyState.noProjects.title')}
                  </Text>
                  <Text fz="xs" maw={220} c="dimmed" ta="center">
                    {t('emptyState.noProjects.description')}
                  </Text>
                </Stack>
              </Center>
            )
          : (
              <Stack gap="xs">
                {projects.map(project => (
                  <ProjectItem
                    project={project}
                    key={project.projectPath}
                  />
                ))}
              </Stack>
            )}
    </Stack>
  );
};

export default I18nManagerNavbar;
