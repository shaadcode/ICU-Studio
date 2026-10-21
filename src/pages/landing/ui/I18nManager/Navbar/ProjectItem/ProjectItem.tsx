import { IconFolder } from '@tabler/icons-react';
import { Box, Text, Group, Paper, Tooltip } from '@mantine/core';

import { ProjectItemMenu } from './menu/ProjectItemMenu';
import type { BaseProjectInfo } from '../CreateNewProject/types';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  project: BaseProjectInfo;
};

export const ProjectItem = ({ project }: Props) => {
  const selectedProject = i18nManagerStore.use.selectedProject();
  const setSelectedProject = i18nManagerStore.use.actions().setSelectedProject;
  const isSelected
    = selectedProject?.path === project.path;

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
        <Tooltip fz={10} openDelay={1500} label={project.path} position="bottom-end">
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
                {project.path}
              </Text>
            </Box>
          </Group>
        </Tooltip>

        <ProjectItemMenu project={project} />
      </Group>
    </Paper>
  );
};
