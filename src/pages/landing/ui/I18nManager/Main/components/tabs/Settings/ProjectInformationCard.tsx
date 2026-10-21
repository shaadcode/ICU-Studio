import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { IconGlobe, IconFileDescription } from '@tabler/icons-react';
import { Card, Grid, Text, Group, Stack, Textarea, TextInput, ThemeIcon } from '@mantine/core';

import type { Project } from '@/pages/landing/config/store/i18nManager/types';

export type ProjectInformationFormValues = {
  name: string;
  description: string;
};

type ProjectInformationCardProps = {
  projectData: Project;
};

export function ProjectInformationCard({ projectData }: ProjectInformationCardProps) {
  const t = useTranslations('i18nManager');

  const form = useForm<ProjectInformationFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      name: projectData.name,
      description: projectData.description,
    },

    validate: {
      name: value =>
        value.trim().length === 0 ? t('settingsTab.projectInformation.errors.nameRequired') : null,
    },
  });

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

      <form onSubmit={form.onSubmit(() => {})}>
        <Grid>
          <Grid.Col span={{ sm: 8, base: 12 }}>
            <Stack h="100%" justify="center">
              <TextInput
                key={form.key('name')}
                label={t('settingsTab.projectInformation.fields.name.label')}
                placeholder={t('settingsTab.projectInformation.fields.name.placeholder')}
                {...form.getInputProps('name')}
              />
              <Textarea
                minRows={3}
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
      </form>
    </Card>
  );
}
