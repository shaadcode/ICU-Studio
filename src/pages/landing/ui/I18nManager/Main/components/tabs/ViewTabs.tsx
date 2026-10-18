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
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  children: ReactNode;
};

export const ViewTabs = ({ children }: Props) => {
  const t = useTranslations('i18nManager');
  const setActiveTab = i18nManagerStore.use.actions().setActiveTab;
  return (
    <Tabs
      defaultValue="structure"

      onChange={v => v && setActiveTab(v as I18nManagerTabKey)}
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
