// components/tabs/Structure/context-menu-items/CopyPathMenuItem.tsx
import { Menu } from '@mantine/core';
import { useTranslations } from 'use-intl';
import { useClipboard } from '@mantine/hooks';
import { IconCopy, IconCheck } from '@tabler/icons-react';

import type { I18nProjectTree } from '@/pages/landing/model/patterns/types';

type Props = {
  onClose: () => void;
  node: I18nProjectTree;
};

export const CopyPathMenuItem = ({ node, onClose }: Props) => {
  const t = useTranslations('i18nManager');
  const clipboard = useClipboard({ timeout: 1500 });

  const handleClick = () => {
    clipboard.copy(node.fullPath);
    onClose();
  };

  return (
    <Menu.Item
      leftSection={
        clipboard.copied ? <IconCheck size={14} /> : <IconCopy size={14} />
      }

      onClick={handleClick}
    >
      {clipboard.copied
        ? t('structure.contextMenu.copied')
        : t('structure.contextMenu.copyPath')}
    </Menu.Item>
  );
};
