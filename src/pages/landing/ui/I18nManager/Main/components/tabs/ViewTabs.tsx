import { Tabs } from '@mantine/core';
// components/tabs/Structure/ViewTabs.tsx
import type { ReactNode } from 'react';
import { useTranslations } from 'use-intl';
import {
  IconStack2,
  IconSitemap,
  IconLanguage,
  IconChartDots,
  IconAdjustments,
} from '@tabler/icons-react';

import type { I18nManagerTabKey } from '../../useHandleI18nManagerMain';

type Props = {
  activeTab: string;
  children: ReactNode;
  onChange: (tab: I18nManagerTabKey) => void;
};

export const ViewTabs = ({ onChange, children, activeTab }: Props) => {
  const t = useTranslations('i18nManager');

  return (
    <Tabs
      value={activeTab}

      onChange={v => v && onChange(v as I18nManagerTabKey)}
    >
      <Tabs.List>
        <Tabs.Tab value="structure" leftSection={<IconSitemap size={14} />}>
          {t('tabs.structure')}
        </Tabs.Tab>
        <Tabs.Tab value="locales" leftSection={<IconLanguage size={14} />}>
          {t('tabs.locales')}
        </Tabs.Tab>
        <Tabs.Tab value="namespaces" leftSection={<IconStack2 size={14} />}>
          {t('tabs.namespaces')}
        </Tabs.Tab>
        <Tabs.Tab value="analysis" leftSection={<IconChartDots size={14} />}>
          {t('tabs.analysis')}
        </Tabs.Tab>
        <Tabs.Tab value="settings" leftSection={<IconAdjustments size={14} />}>
          {t('tabs.settings')}
        </Tabs.Tab>
      </Tabs.List>

      {children}
    </Tabs>
  );
};
