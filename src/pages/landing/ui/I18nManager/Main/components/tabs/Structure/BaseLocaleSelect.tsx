import { useMemo } from 'react';
import ISO6391 from 'iso-639-1';
import { useTranslations } from 'use-intl';
import { Card, Text, Select } from '@mantine/core';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  project: NonNullable<I18nManagerStore['selectedProject']>;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const BaseLocaleSelect = (props: Props) => {
  const t = useTranslations('i18nManager');
  const tCommon = useTranslations('common');
  const updateSelectedProject = i18nManagerStore.use.actions().updateSelectedProject;
  const data = useMemo(
    () =>
      props.projectData.locales.map((code) => {
        const name = ISO6391.getName(code) || code;
        const nativeName = ISO6391.getNativeName(code) || name;

        return {
          value: code,
          label: `${nativeName} — ${name} (${code})`,
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
      <Select
        searchable
        data={data}
        value={props.project.baseLocale}

        onChange={v => v && updateSelectedProject({
          tCommon,
          tI18nManager: t,
          updatedProject: { ...props.project, baseLocale: v },
        })}
      />
    </Card>
  );
};
