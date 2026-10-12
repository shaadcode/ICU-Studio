import { Menubar } from '@mantine/core';
import { useTranslations } from 'use-intl';

import { ToggleNavbarItem } from './items/ToggleNavbarItem';
import { ToggleSidebarItem } from './items/ToggleSidebarItem';

const MenuBar = () => {
  const t = useTranslations('settings');

  return (
    <Menubar>
      <Menubar.Menu width={250}>
        <Menubar.Target>{t('view')}</Menubar.Target>
        <Menubar.Dropdown>
          <ToggleNavbarItem />
          <ToggleSidebarItem />
        </Menubar.Dropdown>
      </Menubar.Menu>
    </Menubar>
  );
};

export default MenuBar;
