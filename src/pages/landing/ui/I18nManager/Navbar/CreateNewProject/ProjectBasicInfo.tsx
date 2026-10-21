import { useState } from 'react';
import { countries } from 'countries-list';
import { useTranslations } from 'use-intl';
import { open } from '@tauri-apps/plugin-dialog';
import type { ComboboxItem } from '@mantine/core';
import type { TCountryCode } from 'countries-list';
import type { UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { CountryFlagRounded } from '@appica/country-flags-react';
import { IconWorld, IconFolder, IconInfoCircle, IconFolderOpen } from '@tabler/icons-react';
import { Text, Stack, Group, Select, Loader, Button, Textarea, TextInput } from '@mantine/core';

import type { StructureType, BaseProjectInfo } from './types';
import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { Locale } from '@/pages/landing/config/store/i18nManager/types';

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
  const [selectedBaseLocale, setSelectedBaseLocale] = useState<Locale | undefined>(undefined);
  const projects = i18nManagerStore.use.projects();
  const handleSelectBaseDirectory = async () => {
    const projectPath = await open({
      multiple: false,
      directory: true,
      recursive: true,
    });

    if (!projectPath) {
      return;
    }

    const isDuplicate = projects.some(project => project.path === projectPath);

    if (isDuplicate) {
      notifications.show({
        color: 'red',
        title: t('basicInfo.duplicateProjectTitle'),
        message: t('basicInfo.duplicateProjectMessage', { path: projectPath }),
      });
      return;
    }

    props.form.setFieldValue('path', projectPath);
    const structureType = props.form.getValues().structureType;
    setIsLocaleScanning(true);
    const localesData = await getLocales(structureType, projectPath);
    setIsLocaleScanning(false);
    const data = localesData.map((l) => {
      const regionData = countries[l.region as TCountryCode];
      return {
        locale: l,
        value: l.language.code,
        label: `${l.language.native} ${`- ${l.region && regionData
          ? regionData.name
          : l.country.name}(${l.language.code})`}`,
      };
    });
    setLocales(data);
    props.setHasLocale(!!data.length);
  };

  const handleClickBaseLocaleSelectOption = (locale: Locale) => {
    setSelectedBaseLocale(locale);
    props.form.setFieldValue('baseLocale', locale);
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
        key={props.form.key('name')}
        label={t('basicInfo.projectName')}
        placeholder={t('basicInfo.projectNamePlaceholder')}
        {...props.form.getInputProps('name')}
      />

      <Textarea
        autosize
        minRows={3}
        maxLength={200}
        label={t('basicInfo.description')}
        key={props.form.key('description')}
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
        {props.form.values.path || t('projectSettings.baseDirectory')}
      </Button>

      {!!locales.length && (
        <Select
          searchable
          withAsterisk
          data={locales}
          allowDeselect={false}
          label={t('basicInfo.baseLocale')}
          key={props.form.key('baseLocale')}
          value={selectedBaseLocale?.language.code}
          placeholder={t('basicInfo.baseLocalePlaceholder')}
          nothingFoundMessage={t('basicInfo.noLocalesFound')}
          disabled={isLocaleScanning || locales.length === 0}
          error={props.form.getInputProps('baseLocale').error}
          rightSection={isLocaleScanning ? <Loader size="xs" /> : undefined}
          leftSection={selectedBaseLocale?.region
            ? (
                <CountryFlagRounded
                  size={20}
                  code={selectedBaseLocale.region ?? 'un'}
                />
              )
            : <IconWorld size={16} />}
          renderOption={({ option }) => {
            const typedOption = option as ComboboxItem<any> & { locale: Locale };

            return (
              <Group gap="sm">
                <CountryFlagRounded
                  size={20}
                  code={typedOption?.locale.region ?? 'un'}
                />
                <Text size="sm">{option.label}</Text>
              </Group>
            );
          }}

          onChange={(_v, option) => {
            const typedOption = option as ComboboxItem<any> & { locale: Locale };
            handleClickBaseLocaleSelectOption(typedOption.locale);
          }}
        />
      )}
    </Stack>
  );
};
