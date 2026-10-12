// MenuBar/Items/ToggleSidebarItem.tsx
import { memo } from 'react';
import { useTranslations } from 'use-intl';

import { MenuItemBase } from '../MenuItemBase';
import { hotkeys } from '@/shared/config/mantine/hotKeys';
import { appStore } from '@/pages/landing/config/store/app';

export const ToggleSidebarItem = memo(() => {
  const tCommon = useTranslations('common');
  const toggle = appStore.use.actions().toggle;

  const handleClick = () => {
    toggle('sidebar');
  };

  return (
    <MenuItemBase
      label={tCommon('sidebar')}
      hotkey={hotkeys.toggleSideBar}

      onClick={handleClick}
    />
  );
});

ToggleSidebarItem.displayName = 'ToggleSidebarItem';
