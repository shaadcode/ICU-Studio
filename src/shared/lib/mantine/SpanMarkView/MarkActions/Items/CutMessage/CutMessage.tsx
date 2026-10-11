import { useTranslations } from 'use-intl';
import { useClipboard } from '@mantine/hooks';
import { Tooltip, MenuItem } from '@mantine/core';
import { IconCheck, IconScissors } from '@tabler/icons-react';

import classes from './CutMessage.module.css';
import { getDelimiterRange } from '@/shared/lib/tiptap';
import type { SharedActionProps } from '../../VariableActions';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

const CutMessageMenuAction = (props: SharedActionProps) => {
  const t = useTranslations('common');
  const removeVariableByReferenceId = icuEditorStore.use.actions().removeVariableByReferenceId;
  const clipboard = useClipboard({ timeout: 500 });

  const handleDeleteMessage = () => {
    const messageRange = getDelimiterRange({
      editor: props.editor,
      referenceId: props.referenceId,
    });

    const from = messageRange?.open?.from;
    const to = messageRange?.close?.to;
    if (to && from) {
      const text = props.editor.view.state.doc.textBetween(from, to);
      props
        .editor
        .chain()
        .setMeta('skipUpdate', true)
        .deleteRange({ to, from })
        .run();
      removeVariableByReferenceId(props.referenceId);
      clipboard.copy(text);
    }
  };

  return (
    <Tooltip label={t('cut')} classNames={{ tooltip: classes['tooltip'] }}>
      <MenuItem
        color={clipboard.copied ? 'orange' : undefined}
        mod={{ 'is-copied': clipboard.copied || undefined }}
        classNames={{
          item: classes['menuItem'],
          itemLabel: classes['menuItemLabel'],
        }}

        onClick={handleDeleteMessage}
      >
        {clipboard.copied
          ? <IconCheck size={17} color="var(--mantine-color-orange-9)" />
          : <IconScissors size={17} />}
      </MenuItem>
    </Tooltip>
  );
};

export default CutMessageMenuAction;
