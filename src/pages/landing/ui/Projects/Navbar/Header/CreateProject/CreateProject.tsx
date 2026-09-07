import { type } from 'arktype';
import { attemptAsync } from 'es-toolkit';
import { useTranslations } from 'use-intl';
import { useDisclosure } from '@mantine/hooks';
import { open } from '@tauri-apps/plugin-dialog';
import { useForm, schemaResolver } from '@mantine/form';
import { IconPlus, IconFolderPlus } from '@tabler/icons-react';
import { Stack, Drawer, Button, TextInput, ActionIcon } from '@mantine/core';

import { appStore } from '@/pages/landing/config/store/app';

export type CreateNewProjectFormValues = {
  name: string;
  dirPath: string;
};

const schema = type({
  name: type('string > 5').configure({ message: 'name error' }),
  dirPath: type('string > 5').configure({ message: 'dirPath error' }),
});

const CreateProject = () => {
  const projectsStore = appStore.use.projectsStore();
  const setProjects = appStore.use.actions().setProjects;
  const [opened, drawerHandlers] = useDisclosure(false);
  const t = useTranslations('projects');
  const tCommon = useTranslations('common');
  const form = useForm<CreateNewProjectFormValues>({
    validate: schemaResolver(schema),
    initialValues: {
      name: '',
      dirPath: '',
    },
  });

  const handleCreateNewProject = async (values: CreateNewProjectFormValues) => {
    const [, projects] = await attemptAsync(async () => {
      await projectsStore?.set?.(values.dirPath, values);
      await projectsStore?.save();
      const projects = await projectsStore?.entries<CreateNewProjectFormValues>() ?? [];
      return projects;
    });

    if (projects?.length) {
      setProjects(projects);
      drawerHandlers.close();
      form.reset();
    }
  };

  const handleSelectDir = async () => {
    const projectDir = await open({
      multiple: false,
      directory: true,
    });

    if (projectDir) {
      form.setFieldValue('dirPath', projectDir);
    }
  };
  return (
    <>
      <ActionIcon
        bd="none"
        variant="default"

        onClick={drawerHandlers.open}
      >
        <IconPlus />
      </ActionIcon>
      <Drawer
        opened={opened}

        onClose={drawerHandlers.close}
      >
        <form onSubmit={form.onSubmit(handleCreateNewProject)}>
          <Stack>
            <TextInput
              tt="capitalize"
              label={`${t('projectName')}`}
              placeholder={tCommon('github')}

              {...form.getInputProps('name')}
            />

            <TextInput
              tt="capitalize"
              label={t('dirPath')}
              placeholder="path\to\folder"
              {...form.getInputProps('dirPath')}
              rightSection={(
                <ActionIcon
                  size="sm"
                  variant="subtle"

                  onClick={handleSelectDir}
                >
                  <IconFolderPlus />
                </ActionIcon>
              )}
            />

            <Button
              type="submit"
            >
              {tCommon('submit')}
            </Button>
          </Stack>
        </form>
      </Drawer>
    </>
  );
};

export default CreateProject;
