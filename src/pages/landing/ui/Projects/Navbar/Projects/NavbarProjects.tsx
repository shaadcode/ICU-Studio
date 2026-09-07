import { IconTrash } from '@tabler/icons-react';
import { Text, Paper, Stack, Group, ActionIcon, ScrollAreaAutosize } from '@mantine/core';

import classes from './NavbarProjects.module.css';
import { appStore } from '@/pages/landing/config/store/app';

const NavbarProjects = () => {
  const projects = appStore.use.projects();
  const deleteProject = appStore.use.actions().deleteProject;
  const setSelectedProject = appStore.use.actions().setSelectedProject;

  const rows = projects.map(([dirPath, value], i) => (
    <Paper
      key={`${dirPath}-${i}`}
      className={classes['project']}

      onClick={() => setSelectedProject(value)}
    >
      <Stack>
        <Group justify="space-between">
          <Text>
            {value.name}
          </Text>

          <ActionIcon
            variant="subtle"

            onClick={async (e) => {
              e.stopPropagation();
              await deleteProject(value);
            }}
          >
            <IconTrash size="80%" />
          </ActionIcon>
        </Group>
      </Stack>
    </Paper>
  ));
  return (
    <ScrollAreaAutosize offsetScrollbars>
      <Stack>
        {rows}
      </Stack>
    </ScrollAreaAutosize>
  );
};

export default NavbarProjects;
