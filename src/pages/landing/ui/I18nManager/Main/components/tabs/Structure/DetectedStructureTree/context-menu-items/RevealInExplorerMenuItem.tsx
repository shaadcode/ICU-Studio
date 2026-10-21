// components/tabs/Structure/context-menu-items/RevealInExplorerMenuItem.tsx
import { Menu } from '@mantine/core';
import { attemptAsync } from 'es-toolkit';
import { useTranslations } from 'use-intl';
import { IconFolderOpen } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { revealItemInDir } from '@tauri-apps/plugin-opener';

type Props = {
  path: string;
};

export const RevealInExplorerMenuItem = ({ path }: Props) => {
  const t = useTranslations('i18nManager');

  const handleClick = async () => {
    const [error] = await attemptAsync(async () => {
      await revealItemInDir(path);
    });

    if (error) {
      notifications.show({
        color: 'red',
        title: t('structure.notifications.revealFailed.title'),
        message: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return (
    <Menu.Item
      leftSection={<IconFolderOpen size={14} />}

      onClick={handleClick}
    >
      {t('structure.contextMenu.revealInExplorer')}
    </Menu.Item>
  );
};
