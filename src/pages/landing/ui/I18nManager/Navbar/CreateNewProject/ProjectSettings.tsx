import { useTranslations } from 'use-intl';
import type { UseFormReturnType } from '@mantine/form';
import { IconFolder, IconSettings } from '@tabler/icons-react';
import { Text, Stack, Group, Button, Switch, TextInput } from '@mantine/core';

import type { ProjectSchema } from './types';

type Props = {
  form: UseFormReturnType<ProjectSchema>;
};

export const ProjectSettings = (props: Props) => {
  const t = useTranslations('i18nManager');
  const tCommon = useTranslations('common');

  return (
    <Stack gap="md">
      <Group gap="xs">
        <IconSettings size={18} />
        <Text fw={600}>{t('projectSettings.title')}</Text>
      </Group>

      <TextInput
        leftSection={<IconFolder size={16} />}
        label={t('projectSettings.baseDirectory')}
        rightSection={(
          <Button variant="subtle" size="compact-xs">
            {tCommon('browse')}
          </Button>
        )}
        {...props.form.getInputProps('baseDirectory')}
      />

      <Switch
        label={t('projectSettings.scanExisting')}
        description={t('projectSettings.scanExistingDesc')}
        {...props.form.getInputProps('scanForExistingStructure', {
          type: 'checkbox',
        })}
      />
    </Stack>
  );
};
