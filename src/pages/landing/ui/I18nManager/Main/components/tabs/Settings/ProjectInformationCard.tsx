import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconGlobe, IconDeviceFloppy, IconFileDescription } from '@tabler/icons-react';
import { Card, Grid, Text, Group, Stack, Button, Textarea, TextInput, ThemeIcon } from '@mantine/core';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import type { BaseProjectInfo } from '../../../../Navbar/CreateNewProject/types';

export type ProjectInformationFormValues = {
  name: string;
  description: string;
};

type ProjectInformationCardProps = {
  projectData: Project;
  project: BaseProjectInfo;
};

export function ProjectInformationCard({ project }: ProjectInformationCardProps) {
  const tCommon = useTranslations('common');
  const t = useTranslations('i18nManager');
  const updateSelectedProject = i18nManagerStore.use.actions().updateSelectedProject;
  const updatingProject = i18nManagerStore.use.updatingProject();

  const form = useForm<ProjectInformationFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      name: project.name,
      description: project.description,
    },

    validate: {
      name: value =>
        value.trim().length === 0 ? t('settingsTab.projectInformation.errors.nameRequired') : null,
    },
  });

  const persistChanges = useDebouncedCallback((values: ProjectInformationFormValues) => {
    updateSelectedProject({
      tCommon,
      tI18nManager: t,
      updatedProject: {
        ...project,
        name: values.name,
        description: values.description,
      },
    });
  }, 500);

  useEffect(() => {
    form.initialize({
      name: project.name,
      description: project.description,
    });
  }, [project]);

  return (
    <Card withBorder radius="md" padding="xl">
      <Group mb="xl" wrap="nowrap" align="flex-start">
        <ThemeIcon>
          <IconFileDescription size="70%" />
        </ThemeIcon>
        <Stack gap={6}>
          <Text fw={500} size="lg">
            {t('settingsTab.projectInformation.title')}
          </Text>
          <Text size="sm" c="dimmed">
            {t('settingsTab.projectInformation.description')}
          </Text>
        </Stack>
      </Group>

      <form onSubmit={form.onSubmit(persistChanges)}>
        <Grid>
          <Grid.Col span={{ sm: 8, base: 12 }}>
            <Stack h="100%" justify="center">
              <TextInput
                key={form.key('name')}
                disabled={updatingProject}
                label={t('settingsTab.projectInformation.fields.name.label')}
                placeholder={t('settingsTab.projectInformation.fields.name.placeholder')}
                {...form.getInputProps('name')}
              />
              <Textarea
                minRows={3}
                disabled={updatingProject}
                key={form.key('description')}
                label={t('settingsTab.projectInformation.fields.description.label')}
                placeholder={t('settingsTab.projectInformation.fields.description.placeholder')}
                {...form.getInputProps('description')}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ sm: 4, base: 12 }}>
            <Stack gap="xs" h="100%" align="center" justify="flex-start">
              <ThemeIcon size={100} variant="transparent">
                <IconGlobe size="70%" />
              </ThemeIcon>

              <Text fw={500} size="sm">
                {t('settingsTab.projectInformation.i18n.title')}
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                {t('settingsTab.projectInformation.i18n.description')}
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>

        <Group mt="xl" justify="flex-start">
          <Button
            type="submit"
            loading={updatingProject}
            disabled={!form.isDirty()}
            leftSection={<IconDeviceFloppy size={16} />}

          >
            {tCommon('update')}
          </Button>
        </Group>
      </form>
    </Card>
  );
}
