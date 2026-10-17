import { useState } from 'react';
import { modals } from '@mantine/modals';
import { Menu, Text } from '@mantine/core';
import { useTranslations } from 'use-intl';
import { IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { I18nProjectTree } from '@/shared/lib/mantine/getI18nProjectData';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  onClose: () => void;
  node: I18nProjectTree;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;

};

export const DeleteLocaleMenuItem = (props: Props) => {
  const t = useTranslations('i18nManager');
  const [isLoading, setIsLoading] = useState(false);
  const setSelectedProjectData = i18nManagerStore.use.actions().setSelectedProjectData;

  const handleClick = () => {
    props.onClose();

    modals.openConfirmModal({
      centered: true,
      title: t('structure.modals.deleteLocale.title'),
      confirmProps: { color: 'red', loading: isLoading },
      labels: {
        cancel: t('structure.modals.deleteLocale.cancel'),
        confirm: t('structure.modals.deleteLocale.confirm'),
      },
      children: (
        <Text size="sm">
          {t('structure.modals.deleteLocale.message', {
            locale: String(props.node.label),
          })}
        </Text>
      ),
      onConfirm: async () => {
        setIsLoading(true);
        const patternActions = i18nManagerPatternsActions[props.projectData.structureType];
        const [error] = await patternActions.deleteLocale({
          ...props.projectData,
          setSelectedProjectData,
          localeNode: props.node,
        });
        setIsLoading(false);

        if (error) {
          notifications.show({
            color: 'red',
            title: t('structure.notifications.localeDeleteFailed.title'),
            message: error instanceof Error ? error.message : String(error),
          });
          return;
        }

        notifications.show({
          color: 'green',
          title: t('structure.notifications.localeDeleted.title'),
          message: t('structure.notifications.localeDeleted.message', {
            locale: String(props.node.label),
          }),
        });
      },
    });
  };

  if (!props.node.isLocale) {
    return null;
  }

  return (
    <Menu.Item
      leftSection={<IconTrash size={14} color="var(--mantine-color-red-6)" />}

      onClick={handleClick}
    >
      {t('structure.contextMenu.deleteLocale')}
    </Menu.Item>
  );
};
