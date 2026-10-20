import { modals } from '@mantine/modals';
import { Menu, Text } from '@mantine/core';
import { useTranslations } from 'use-intl';
import { IconTrash } from '@tabler/icons-react';

import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  namespace: Project['namespaces'][number];
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const DeleteNamespaceMenuItem = ({ namespace, projectData }: Props) => {
  const tCommon = useTranslations('common');
  const t = useTranslations('i18nManager');
  const setSelectedProjectData = i18nManagerStore.use.actions().setSelectedProjectData;
  const handleClick = () => {
    modals.openConfirmModal({
      centered: true,
      confirmProps: { color: 'red' },
      title: t('structure.modals.deleteNamespace.title'),
      labels: {
        cancel: tCommon('cancel'),
        confirm: tCommon('delete'),
      },
      children: (
        <Text size="sm">
          {t('structure.modals.deleteNamespace.message', {
            namespace: namespace.name,
            count: projectData.locales.length,
          })}
        </Text>
      ),
      onConfirm: async () => {
        const patternAction = i18nManagerPatternsActions[projectData.structureType];
        await patternAction.deleteNamespace({
          ...projectData,
          namespace,
          setSelectedProjectData,
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
      {tCommon('delete')}
    </Menu.Item>
  );
};
