import { IconFolder } from '@tabler/icons-react';
import { Box, Text, Group, Paper } from '@mantine/core';

import type { ProjectSchema } from './CreateNewProject/types';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  project: ProjectSchema;
};

export const ProjectItem = ({ project }: Props) => {
  const selectedProject = i18nManagerStore.use.selectedProject();
  const setSelectedProject = i18nManagerStore.use.actions().setSelectedProject;
  const isSelected = selectedProject?.baseDirectoryPath === project.baseDirectoryPath;

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
      </Group>
    </Paper>
  );
};
