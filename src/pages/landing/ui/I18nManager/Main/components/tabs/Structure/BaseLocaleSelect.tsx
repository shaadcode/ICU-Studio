import { useTranslations } from 'use-intl';
import { Card, Text, Select } from '@mantine/core';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  onChange: (value: string) => void;
  locales: NonNullable<I18nManagerStore['selectedProjectData']>['locales'];
};

export const BaseLocaleSelect = ({ locales, onChange }: Props) => {
  const t = useTranslations('i18nManager');
  const data = locales.map(l => ({
    value: l,
    label: `${l} (${l})`,
  }));

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

        onChange={v => v && onChange(v)}
      />
    </Card>
  );
};
