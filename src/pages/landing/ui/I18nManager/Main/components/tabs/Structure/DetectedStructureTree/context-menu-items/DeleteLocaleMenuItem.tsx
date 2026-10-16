import { modals } from '@mantine/modals';
import { Menu, Text } from '@mantine/core';
import { useTranslations } from 'use-intl';
import { IconTrash } from '@tabler/icons-react';

import { useDetectedStructureTree } from '../useDetectedStructureTree';
import type { I18nProjectTree } from '@/shared/lib/mantine/getI18nProjectData';

type Props = {
  onClose: () => void;
  node: I18nProjectTree;
};

export const DeleteLocaleMenuItem = ({ node, onClose }: Props) => {
  const t = useTranslations('i18nManager');
  const { isLoading, deleteLocale } = useDetectedStructureTree();

  const handleClick = () => {
    onClose();

    modals.openConfirmModal({
      onConfirm: () => deleteLocale(node),
      title: t('structure.modals.deleteLocale.title'),
      confirmProps: { color: 'red', loading: isLoading },
      labels: {
        cancel: t('structure.modals.deleteLocale.cancel'),
        confirm: t('structure.modals.deleteLocale.confirm'),
      },
      children: (
        <Text size="sm">
          {t('structure.modals.deleteLocale.message', {
            locale: String(node.label),
          })}
        </Text>
      ),
    });
  };

  if (!node.isLocale) {
    return null;
  }

  return (
    <Menu.Item
      color="red"
      leftSection={<IconTrash size={14} />}

      onClick={handleClick}
    >
      {t('structure.contextMenu.deleteLocale')}
    </Menu.Item>
  );
};
