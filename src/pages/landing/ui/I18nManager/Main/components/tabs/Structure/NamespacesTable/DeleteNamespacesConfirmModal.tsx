import { modals } from '@mantine/modals';
import { ActionIcon } from '@mantine/core';
import { useTranslations } from 'use-intl';
import { IconTrash } from '@tabler/icons-react';

import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
// components/tabs/Structure/DeleteNamespacesConfirmModal.tsx
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  selection: Array<string>;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export default function OpenDeleteNamespacesConfirm(params: Props) {
  const tCommon = useTranslations('common');
  const t = useTranslations('i18nManager');
  const setSelectedProjectData = i18nManagerStore.use.actions().setSelectedProjectData;

  async function handleDeleteNamespaces() {
    const patternActions = i18nManagerPatternsActions[params.projectData.structureType];
    await Promise.all(
      params.selection.map(
        async (namespaceName) => {
          const targetNamespace = params.projectData.namespaces.find(ns => ns.name === namespaceName);

          if (!targetNamespace) {
            console.error('namespace not found in deleteNamespace');
            return;
          }
          await patternActions.deleteNamespace({
            ...params.projectData,
            setSelectedProjectData,
            namespace: targetNamespace,
          });
        },
      ),
    );
  }
  const handleClick = () => modals.openConfirmModal({
    centered: true,
    confirmProps: { color: 'red' },
    onConfirm: handleDeleteNamespaces,
    title: t('structure.modals.deleteNamespace.title'),
    labels: {
      cancel: tCommon('cancel'),
      confirm: tCommon('delete'),
    },
    children: t(
      'structure.modals.deleteNamespace.message',
      { count: params.selection.length },
    ),
  });

  return (
    <ActionIcon
      size="sm"
      color="orange"
      variant="subtle"
      aria-label={t('structure.modals.deleteNamespace.title')}

      onClick={handleClick}
    >
      <IconTrash size={14} />
    </ActionIcon>
  );
}
