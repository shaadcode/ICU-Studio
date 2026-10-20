import { useState } from 'react';
import { modals } from '@mantine/modals';
import { useTranslations } from 'use-intl';
import { IconDots, IconTrash, IconFolder } from '@tabler/icons-react';
import { Box, Text, Menu, Group, Paper, Tooltip, ActionIcon } from '@mantine/core';

import type { BaseProjectInfo } from './CreateNewProject/types';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  project: BaseProjectInfo;
};

export const ProjectItem = ({ project }: Props) => {
  const selectedProject = i18nManagerStore.use.selectedProject();
  const setSelectedProject = i18nManagerStore.use.actions().setSelectedProject;
  const deleteProject = i18nManagerStore.use.actions().deleteProject;
  const [isLoading, setIsLoading] = useState(false);
  const tCommon = useTranslations('common');
  const tI18nManager = useTranslations('i18nManager');
  const isSelected
    = selectedProject?.projectPath === project.projectPath;

  const openDeleteConfirmModal = (e: React.MouseEvent) => {
    e.stopPropagation();

    modals.openConfirmModal({
      centered: true,
      cancelProps: { disabled: isLoading },
      confirmProps: { color: 'red', loading: isLoading },
      title: tI18nManager('structure.modals.deleteProject.title'),
      labels: {
        cancel: tCommon('cancel'),
        confirm: tCommon('delete'),
      },
      onConfirm: async () => {
        setIsLoading(true);
        await deleteProject({ project, tCommon, tI18nManager });
        setIsLoading(false);
      },
      children: (
        <Text size="sm">
          {tI18nManager('structure.modals.deleteProject.message', { projectName: project.name })}
        </Text>
      ),
    });
  };

  return (
    <Paper
      p="xs"
      withBorder
      radius="md"
      style={{
        cursor: 'pointer',
        borderColor: isSelected ? 'var(--mantine-color-green-6)' : undefined,
      }}

      onClick={() => setSelectedProject(project)}
    >
      <Group gap="xs" wrap="nowrap" justify="space-between">
        <Tooltip fz={10} openDelay={1500} position="bottom-end" label={project.projectPath}>
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
                {project.projectPath}
              </Text>
            </Box>
          </Group>
        </Tooltip>

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

              onClick={openDeleteConfirmModal}
            >
              {tCommon('delete')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Paper>
  );
};
