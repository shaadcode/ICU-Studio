import { memo } from 'react';
import { useTranslations } from 'use-intl';

import { MenuItemBase } from '../MenuItemBase';
import { hotkeys } from '@/shared/config/mantine/hotKeys';
import { appStore } from '@/pages/landing/config/store/app';

export const ToggleNavbarItem = memo(() => {
  const tCommon = useTranslations('common');
  const toggle = appStore.use.actions().toggle;

  const handleClick = () => {
    toggle('navbar');
  };

  return (
    <MenuItemBase
      label={tCommon('navbar')}
      hotkey={hotkeys.toggleNavbar}

      onClick={handleClick}
    />
  );
});

ToggleNavbarItem.displayName = 'ToggleNavbarItem';
