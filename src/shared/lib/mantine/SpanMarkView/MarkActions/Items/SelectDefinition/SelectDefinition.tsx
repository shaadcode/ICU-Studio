// Items/SelectDefinition/SelectDefinition.tsx
import { MenuItem } from '@mantine/core';
import { useTranslations } from 'use-intl';

import { getDelimiterRange } from '@/shared/lib/tiptap';
import type { SharedActionProps } from '../../VariableActions';

const SelectDefinitionMenuAction = (props: SharedActionProps) => {
  const t = useTranslations('common');

  const handleSelectDefinition = () => {
    const messageRange = getDelimiterRange({
      editor: props.editor,
      referenceId: props.referenceId,
    });

    const from = messageRange?.open?.from;
    const to = messageRange?.close?.to;

    if (!from || !to) {
      return;
    }

    props.editor
      .chain()
      .focus()
      .setTextSelection({ to, from })
      .scrollIntoView()
      .run();
  };

  return (
    <MenuItem
      tt="capitalize"

      onClick={handleSelectDefinition}
    >
      {t('selectDefinition')}
    </MenuItem>
  );
};

export default SelectDefinitionMenuAction;
