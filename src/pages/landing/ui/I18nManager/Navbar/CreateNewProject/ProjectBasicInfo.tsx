import { useState } from 'react';
import { useTranslations } from 'use-intl';
import type { LanguageCode } from 'iso-639-1';
import { open } from '@tauri-apps/plugin-dialog';
import type { ComboboxItem } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { CountryFlagRounded } from '@appica/country-flags-react';
import { IconWorld, IconFolder, IconInfoCircle, IconFolderOpen } from '@tabler/icons-react';
import { Text, Stack, Group, Select, Loader, Button, Textarea, TextInput } from '@mantine/core';

import { localeInfoMap } from '@/shared/lib/icu';
import type { StructureType, BaseProjectInfo } from './types';
import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';

type Props = {
  form: UseFormReturnType<BaseProjectInfo>;
  setHasLocale: React.Dispatch<React.SetStateAction<boolean>>;
};

async function getLocales(structureType: StructureType, projectPath: string) {
  const patternAction = i18nManagerPatternsActions[structureType];
  return patternAction.getLocales({ projectPath });
}

export const ProjectBasicInfo = (props: Props) => {
  const t = useTranslations('i18nManager');
  const [isLocaleScanning, setIsLocaleScanning] = useState(false);
  const [locales, setLocales] = useState<Array<ComboboxItem<string>>>([]);

  const handleSelectBaseDirectory = async () => {
    const projectPath = await open({
      multiple: false,
      directory: true,
      recursive: true,
    });
    if (projectPath) {
      props.form.setFieldValue('projectPath', projectPath);
      const structureType = props.form.getValues().structureType;
      setIsLocaleScanning(true);
      const localesData = await getLocales(structureType, projectPath);
      setIsLocaleScanning(false);
      const data = localesData.map(l => ({
        value: l.language.code,
        label: `${l.language.native} - ${l.language.code}`,
      }));
      setLocales(data);
      props.setHasLocale(!!data.length);
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

      <Button
        fullWidth
        variant="default"
        justify="space-between"
        leftSection={<IconFolder size={16} />}
        rightSection={<IconFolderOpen size={16} />}

        onClick={handleSelectBaseDirectory}
      >
        {props.form.values.projectPath || t('projectSettings.baseDirectory')}
      </Button>

      {!!locales.length && (
        <Select
          searchable
          withAsterisk
          data={locales}
          allowDeselect={false}
          label={t('basicInfo.baseLocale')}
          leftSection={<IconWorld size={16} />}
          placeholder={t('basicInfo.baseLocalePlaceholder')}
          nothingFoundMessage={t('basicInfo.noLocalesFound')}
          disabled={isLocaleScanning || locales.length === 0}
          rightSection={isLocaleScanning ? <Loader size="xs" /> : undefined}
          renderOption={({ option }) => {
            const localeInfo = localeInfoMap[option.value as LanguageCode];
            return (
              <Group gap="sm">
                <CountryFlagRounded
                  size={20}
                  code={localeInfo?.region ?? 'un'}
                />
                <Text size="sm">{option.label}</Text>
              </Group>
            );
          }}
          {...props.form.getInputProps('baseLocale')}
        />
      )}
    </Stack>
  );
};
