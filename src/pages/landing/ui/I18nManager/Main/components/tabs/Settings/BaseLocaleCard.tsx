import { useTranslations } from 'use-intl';
import { countries } from 'countries-list';
import type { ComboboxItem } from '@mantine/core';
import type { TCountryCode } from 'countries-list';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconGlobe, IconWorld } from '@tabler/icons-react';
import { CountryFlagRounded } from '@appica/country-flags-react';
import { Card, Text, Group, Stack, Select, ThemeIcon } from '@mantine/core';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { BaseProjectInfo } from '../../../../Navbar/CreateNewProject/types';
import type { Locale, Project } from '@/pages/landing/config/store/i18nManager/types';

export type DefaultLocaleFormValues = {
  locale: null | string;
};

type LocaleOption = { locale: Locale } & ComboboxItem<any>;

type DefaultLocaleCardProps = {
  projectData: Project;
  project: BaseProjectInfo;
};

export function BaseLocaleCard({ project, projectData }: DefaultLocaleCardProps) {
  const tCommon = useTranslations('i18nManager');
  const t = useTranslations('i18nManager');
  const updateSelectedProject = i18nManagerStore.use.actions().updateSelectedProject;
  const updatingProject = i18nManagerStore.use.updatingProject();
  const changeBaseLocale = useDebouncedCallback((newBaseLocale: Locale) => {
    updateSelectedProject({
      tCommon,
      tI18nManager: t,
      updatedProject: {
        ...project,
        baseLocale: newBaseLocale,
      },
    });
  }, 500);

  const localeOptions = projectData.locales.map((l) => {
    const regionData = countries[l.region as TCountryCode];
    return {
      locale: l,
      value: l.language.code,
      label: `${l.language.native} ${`- ${l.region && regionData
        ? regionData.name
        : l.country.name}(${l.language.code})`}`,
    } as LocaleOption;
  });

  return (
    <Card withBorder radius="md" padding="xl">
      <Group mb="xl" wrap="nowrap" align="flex-start">
        <ThemeIcon>
          <IconGlobe size="70%" />
        </ThemeIcon>
        <Stack gap={6}>
          <Text fw={500} size="lg">
            {t('settingsTab.defaultLocale.title')}
          </Text>
          <Text size="sm" c="dimmed">
            {t('settingsTab.defaultLocale.description')}
          </Text>
        </Stack>
      </Group>

      <Select
        data={localeOptions}
        allowDeselect={false}
        value={project.baseLocale?.language.code}
        placeholder={t('basicInfo.baseLocalePlaceholder')}
        nothingFoundMessage={t('basicInfo.noLocalesFound')}
        disabled={updatingProject || projectData.locales.length === 0}
        leftSection={project.baseLocale
          ? (
              <CountryFlagRounded
                size={20}
                code={project.baseLocale.region ?? 'un'}
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
          changeBaseLocale(typedOption.locale);
        }}
      />
    </Card>
  );
}
