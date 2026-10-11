import { MenuItem } from '@mantine/core';
import { useTranslations } from 'use-intl';

import { getDelimiterRange } from '@/shared/lib/tiptap';
import type { SharedActionProps } from '../../VariableActions';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

const DuplicateMessageMenuAction = (props: SharedActionProps) => {
  const t = useTranslations('common');
  const formatContent = icuEditorStore.use.actions().formatContent;

  const handleDuplicateMessage = () => {
    const messageRange = getDelimiterRange({
      editor: props.editor,
      referenceId: props.referenceId,
    });

    const from = messageRange?.open?.from;
    const to = messageRange?.close?.to;

    if (!from || !to) {
      return;
    }

    let varName = '';
    props.editor.state.doc.descendants((node) => {
      if (node.isText && node.marks[0]?.attrs['data-reference-id'] === props.referenceId) {
        varName = node.text!;
        return false;
      }
      return true;
    });

    const variableBody = props.editor.state.doc.textBetween(from, to);

    props.editor
      .chain()
      .setMeta('skipUpdate', true)
      .insertContentAt(to, ` ${variableBody.replace(varName, `${varName}Copy`)}`)
      .run();

    formatContent({ editor: props.editor });
  };

  return (
    <MenuItem
      tt="capitalize"

      onClick={handleDuplicateMessage}
    >
      {t('duplicate')}
    </MenuItem>
  );
};

export default DuplicateMessageMenuAction;
