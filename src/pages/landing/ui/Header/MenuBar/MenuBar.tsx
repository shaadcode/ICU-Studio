import { useTranslations } from 'use-intl';
import { Menu, Text, Menubar } from '@mantine/core';

const MenuBar = () => {
  const t = useTranslations('settings');
  return (
    <Menubar>
      <Menubar.Menu width={220}>
        <Menubar.Target>{t('file')}</Menubar.Target>
        <Menubar.Dropdown>
          <Menu.Item rightSection={<Text size="xs" c="dimmed">{'⌘N'}</Text>}>{'New file'}</Menu.Item>
          <Menu.Item rightSection={<Text size="xs" c="dimmed">{'⌘⇧N'}</Text>}>{'New window'}</Menu.Item>
          <Menu.Sub>
            <Menu.Sub.Target>
              <Menu.Sub.Item>{'Open recent'}</Menu.Sub.Item>
            </Menu.Sub.Target>
            <Menu.Sub.Dropdown>
              <Menu.Item>{'project-alpha'}</Menu.Item>
              <Menu.Item>{'project-beta'}</Menu.Item>
              <Menu.Item>{'project-gamma'}</Menu.Item>
            </Menu.Sub.Dropdown>
          </Menu.Sub>
          <Menu.Divider />
          <Menu.Item rightSection={<Text size="xs" c="dimmed">{'⌘S'}</Text>}>{'Save'}</Menu.Item>
          <Menu.Item>{'Save as…'}</Menu.Item>
        </Menubar.Dropdown>
      </Menubar.Menu>
    </Menubar>
  );
};

export default MenuBar;
