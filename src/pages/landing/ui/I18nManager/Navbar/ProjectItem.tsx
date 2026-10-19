import { useTranslations } from 'use-intl';
import { IconDots, IconTrash, IconFolder } from '@tabler/icons-react';
import { Box, Text, Menu, Group, Paper, ActionIcon } from '@mantine/core';

import type { BaseProjectInfo } from './CreateNewProject/types';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  project: BaseProjectInfo;
};

export const ProjectItem = ({ project }: Props) => {
  const selectedProject = i18nManagerStore.use.selectedProject();
  const setSelectedProject = i18nManagerStore.use.actions().setSelectedProject;
  const deleteProject = i18nManagerStore.use.actions().deleteProject;
  const tCommon = useTranslations('common');
  const tI18nManager = useTranslations('i18nManager');
  const isSelected
    = selectedProject?.baseDirectoryPath === project.baseDirectoryPath;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteProject({ project, tCommon, tI18nManager });
  };

  return (
    <Paper
      p="xs"
      radius="md"
      withBorder={isSelected}
      style={{
        cursor: 'pointer',
        borderColor: isSelected ? 'var(--mantine-color-green-6)' : undefined,
      }}

      onClick={() => setSelectedProject(project)}
    >
      <Group gap="xs" wrap="nowrap" justify="space-between">
        <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          <IconFolder
            size={16}
            style={{ flexShrink: 0 }}
            color="var(--mantine-color-blue-6)"
          />
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text fz="sm" fw={500} truncate>
              {project.name}
            </Text>
            <Text fz="xs" truncate c="dimmed">
              {project.baseDirectoryPath}
            </Text>
          </Box>
        </Group>

        <Menu shadow="md" width={160} position="bottom-end">
          <Menu.Target>
            <ActionIcon
              size="sm"
              color="gray"
              variant="subtle"

              onClick={e => e.stopPropagation()}
            >
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown onClick={e => e.stopPropagation()}>
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={14} />}

              onClick={handleDelete}
            >
              {'Delete\r'}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Paper>
  );
};
