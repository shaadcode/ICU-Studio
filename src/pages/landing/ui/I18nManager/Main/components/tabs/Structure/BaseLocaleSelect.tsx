import { useMemo } from 'react';
import { useTranslations } from 'use-intl';
import type { ComboboxItem } from '@mantine/core';
import { IconLanguageOff } from '@tabler/icons-react';
import { CountryFlagRounded } from '@appica/country-flags-react';
import { Card, Text, Stack, Group, Select, Center, ThemeIcon } from '@mantine/core';

import { parseLocale } from '@/shared/lib/icu';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type LocaleSelectOption = {
  countryCode: string;
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
          value: locale.code,
          countryCode: locale.region,
          label: `${locale.native} — ${locale.region} (${locale.code})`,
        } as LocaleSelectOption;
      }),
    [props.projectData.locales],
  );

  const baseLocaleRegion = useMemo(() => {
    const parsed = parseLocale(props.projectData.baseLocale);
    return parsed.region;
  }, [props.projectData.baseLocale]);
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
              value={props.project.baseLocale}
              placeholder={t('structure.baseLocalePlaceholder')}
              leftSection={(
                <CountryFlagRounded
                  size={20}
                  code={baseLocaleRegion ?? 'un'}
                />
              )}
              renderOption={({ option }) => {
                const typedOption = option as LocaleSelectOption;
                return (
                  <Group gap="sm">
                    <CountryFlagRounded
                      size={20}
                      code={typedOption['countryCode'] ?? 'un'}
                    />
                    <Text size="sm">{typedOption.label}</Text>
                  </Group>
                );
              }}

              onChange={v =>
                v
                && updateSelectedProject({
                  tCommon,
                  tI18nManager: t,
                  updatedProject: { ...props.project, baseLocale: v },
                })}
            />
          )}
    </Card>
  );
};
