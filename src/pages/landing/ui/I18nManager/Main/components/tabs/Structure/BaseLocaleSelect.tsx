import { useMemo } from 'react';
import { useTranslations } from 'use-intl';
import type { ComboboxItem } from '@mantine/core';
import { IconLanguageOff } from '@tabler/icons-react';
import { CountryFlagRounded } from '@appica/country-flags-react';
import { Card, Text, Stack, Group, Select, Center, ThemeIcon } from '@mantine/core';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { Locale } from '@/pages/landing/config/store/i18nManager/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type LocaleSelectOption = {
  locale: Locale;
} & ComboboxItem<string>;

type Props = {
  project: NonNullable<I18nManagerStore['selectedProject']>;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const BaseLocaleSelect = (props: Props) => {
  const tCommon = useTranslations('common');
  const t = useTranslations('i18nManager');
  const updateSelectedProject = i18nManagerStore.use.actions().updateSelectedProject;

  const isEmpty = props.projectData.locales.length === 0;

  const data = useMemo(
    () =>
      props.projectData.locales.map((locale) => {
        return {
          locale,
          value: locale.language.code,
          label: `${locale.native} — ${locale.region} (${locale.language.code})`,
        } as LocaleSelectOption;
      }),
    [props.projectData.locales],
  );

  async function handleUpdateBaseLocale(newBaseLocale: Locale) {
    await updateSelectedProject({
      tCommon,
      tI18nManager: t,
      updatedProject: { ...props.project, baseLocale: newBaseLocale },
    });
  }

  const baseLocale = props.project.baseLocale;
  return (
    <Card withBorder radius="md" padding="md">
      <Text
        mb={4}
        fw={600}
        size="sm"
      >
        {t('structure.baseLocale')}
      </Text>
      <Text mb="sm" size="xs" c="dimmed">
        {t('structure.baseLocaleHint')}
      </Text>

      {isEmpty
        ? (
            <Center py="md">
              <Stack gap="sm" align="center">
                <ThemeIcon size={50} radius="xl" color="gray" variant="light">
                  <IconLanguageOff size={26} />
                </ThemeIcon>
                <Text size="sm" c="dimmed" ta="center">
                  {t('structure.emptyBaseLocale')}
                </Text>
              </Stack>
            </Center>
          )
        : (
            <Select
              searchable
              data={data}
              allowDeselect={false}
              value={baseLocale?.language.code}
              placeholder={t('structure.baseLocalePlaceholder')}
              leftSection={(
                <CountryFlagRounded
                  size={20}
                  code={baseLocale?.region ?? 'un'}
                />
              )}
              renderOption={({ option }) => {
                const typedOption = option as LocaleSelectOption;
                return (
                  <Group
                    gap="sm"

                    onClick={() => handleUpdateBaseLocale(typedOption.locale)}
                  >
                    <CountryFlagRounded
                      size={20}
                      code={typedOption.locale.region ?? 'un'}
                    />
                    <Text size="sm">{typedOption.label}</Text>
                  </Group>
                );
              }}
            />
          )}
    </Card>
  );
};
