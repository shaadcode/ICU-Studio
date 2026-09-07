import { Tabs } from '@mantine/core';
import { useTranslations } from 'use-intl';

import classes from './Header.module.css';
import { appStore } from '@/pages/landing/config/store/app';

export type ViewTabsItems = 'editor' | 'projects';
const Header = () => {
  const view = appStore.use.view();
  const setView = appStore.use.actions().setView;
  const t = useTranslations('common');

  return (
    <Tabs
      mx="auto"
      maw={350}
      value={view}
      defaultValue={'editor' as ViewTabsItems}
      classNames={{ tabLabel: classes['tabLabel'] }}

      // @ts-expect-error
      onChange={setView}
    >
      <Tabs.List grow>
        <Tabs.Tab value={'editor' as ViewTabsItems}>
          {t('editor')}
        </Tabs.Tab>
        <Tabs.Tab value={'projects' as ViewTabsItems}>
          {t('project', { project: 'other' })}
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};

export default Header;
