import { modals } from '@mantine/modals';
import { useTranslations } from 'use-intl';
import { Text, ActionIcon } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

import type { OnBackJsonEditor } from '../useHandleJsonEditor';

type Props = {
  canUndo: boolean;
  onBack: OnBackJsonEditor;
};

export const JsonEditorBackButton = ({ onBack, canUndo }: Props) => {
  const tCommon = useTranslations('common');
  const t = useTranslations('i18nManager');

  const handleClick = () => {
    if (!canUndo) {
      onBack();
      return;
    }

    modals.openConfirmModal({
      title: t('jsonEditor.modals.unsavedChanges.unsavedChangesTitle'),
      onConfirm: () => {
        onBack({ saveChanges: true });
      },
      labels: {
        confirm: tCommon('saveAndClose'),
        cancel: tCommon('discardChanges'),
      },
      children: (
        <Text>
          {t('jsonEditor.modals.unsavedChanges.unsavedChangesMessage')}
        </Text>
      ),
    });
  };

  return (
    <ActionIcon
      size="sm"
      variant="subtle"

      onClick={handleClick}
    >
      <IconArrowLeft size={16} />
    </ActionIcon>
  );
};
