// components/tabs/Structure/context-menu-items/DeleteNamespaceMenuItem.tsx
import { useState } from 'react';
import { modals } from '@mantine/modals';
import { Menu, Text } from '@mantine/core';
import { useTranslations } from 'use-intl';
import { IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  onClose: () => void;
  namespaceName: string;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const DeleteNamespaceMenuItem = (props: Props) => {
  const t = useTranslations('i18nManager');
  const [isLoading, setIsLoading] = useState(false);
  const setSelectedProjectData = i18nManagerStore.use.actions().setSelectedProjectData;

  const handleClick = () => {
    props.onClose();

    modals.openConfirmModal({
      centered: true,
      title: t('structure.modals.deleteNamespace.title'),
      confirmProps: { color: 'red', loading: isLoading },
      labels: {
        cancel: t('structure.modals.deleteNamespace.cancel'),
        confirm: t('structure.modals.deleteNamespace.confirm'),
      },
      children: (
        <Text size="sm">
          {t('structure.modals.deleteNamespace.message', {
            namespace: props.namespaceName,
            count: props.projectData.locales.length,
          })}
        </Text>
      ),
      onConfirm: async () => {
        setIsLoading(true);
        const patternActions = i18nManagerPatternsActions[props.projectData.structureType];

        const [error] = await patternActions.deleteNamespace({
          ...props.projectData,
          setSelectedProjectData,
          namespaceName: props.namespaceName,
        });

        setIsLoading(false);

        if (error) {
          notifications.show({
            color: 'red',
            title: t('structure.notifications.namespaceDeleteFailed.title'),
            message: error instanceof Error ? error.message : String(error),
          });
          return;
        }

        notifications.show({
          color: 'green',
          title: t('structure.notifications.namespaceDeleted.title'),
          message: t('structure.notifications.namespaceDeleted.message', {
            namespace: props.namespaceName,
          }),
        });
      },
    });
  };

  return (
    <Menu.Item
      color="red"
      leftSection={<IconTrash size={14} />}

      onClick={handleClick}
    >
      {t('structure.contextMenu.deleteNamespace')}
    </Menu.Item>
  );
};
