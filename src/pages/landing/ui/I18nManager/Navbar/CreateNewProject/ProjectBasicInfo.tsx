import { useTranslations } from 'use-intl';
import { open } from '@tauri-apps/plugin-dialog';
import type { UseFormReturnType } from '@mantine/form';
import { IconFolder, IconInfoCircle, IconFolderOpen } from '@tabler/icons-react';
import { Text, Stack, Group, Textarea, TextInput, ActionIcon } from '@mantine/core';

import type { ProjectSchema } from './types';

type Props = {
  form: UseFormReturnType<ProjectSchema>;
};

export const ProjectBasicInfo = (props: Props) => {
  const t = useTranslations('i18nManager');
  const tCommon = useTranslations('common');

  const handleSelectBaseDirectory = async () => {
    const localesFolderPath = await open({
      multiple: false,
      directory: true,
      recursive: true,
    });
    if (localesFolderPath) {
      props.form.setFieldValue('baseDirectoryPath', localesFolderPath);
    }
  };
  return (
    <Stack gap="md">
      <Group gap="xs">
        <IconInfoCircle size={18} />
        <Text fw={600}>{t('basicInfo.title')}</Text>
      </Group>

      <TextInput
        withAsterisk
        maxLength={50}
        label={t('basicInfo.projectName')}
        placeholder={t('basicInfo.projectNamePlaceholder')}
        {...props.form.getInputProps('name')}
      />

      <Textarea
        autosize
        minRows={3}
        maxLength={200}
        label={t('basicInfo.description')}
        placeholder={t('basicInfo.descriptionPlaceholder')}
        {...props.form.getInputProps('description')}
      />

      <TextInput
        withAsterisk
        placeholder="path/to/messages"
        leftSection={<IconFolder size={16} />}
        label={t('projectSettings.baseDirectory')}
        rightSection={(
          <ActionIcon
            bdrs={5}
            size="sm"
            variant="subtle"
            aria-label={tCommon('browse')}

            onClick={handleSelectBaseDirectory}
          >
            <IconFolderOpen size={16} />
          </ActionIcon>
        )}
        {...props.form.getInputProps('baseDirectoryPath')}
      />
    </Stack>
  );
};
