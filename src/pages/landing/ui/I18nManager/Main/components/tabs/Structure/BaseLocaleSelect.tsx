import { useMemo } from 'react';
import ISO6391 from 'iso-639-1';
import { useTranslations } from 'use-intl';
import { IconLanguageOff } from '@tabler/icons-react';
import { Card, Text, Stack, Select, Center, ThemeIcon } from '@mantine/core';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

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
        const name = ISO6391.getName(locale.code) || locale.code;
        const nativeName = ISO6391.getNativeName(locale.code) || name;

        return {
          value: locale.code,
          label: `${nativeName} — ${name} (${locale.code})`,
        };
      }),
    [props.projectData.locales],
  );

  return (
    <Card withBorder radius="md" padding="md">
      <Text mb={4} fw={600} size="sm">
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
