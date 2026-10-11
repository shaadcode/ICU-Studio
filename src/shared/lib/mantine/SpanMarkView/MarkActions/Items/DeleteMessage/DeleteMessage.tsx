import { useTranslations } from 'use-intl';
import { IconTrash } from '@tabler/icons-react';
import { Tooltip, MenuItem } from '@mantine/core';

import type { SharedActionProps } from '../../VariableActions';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import { getDelimiterRange } from '../../../../../tiptap/getDelimiterRange';

const DeleteMessageMenuAction = (props: SharedActionProps) => {
  const t = useTranslations('common');
  const formatContent = icuEditorStore.use.actions().formatContent;
  const handleDeleteMessage = () => {
    const messageRange = getDelimiterRange({
      editor: props.editor,
      referenceId: props.referenceId,
    });

    const from = messageRange.open.from;
    const to = messageRange.close.to;

    if (to && from) {
      props
        .editor
        .chain()
        .setMeta('skipUpdate', true)
        .deleteRange({ to, from })
        .run();
      formatContent({ editor: props.editor });
    }
  };

  return (
    <Tooltip label={t('delete')}>
      <MenuItem
        p={7}
        color="red"

        onClick={handleDeleteMessage}
      >
        <IconTrash size={17} />
      </MenuItem>
    </Tooltip>
  );
};

export default DeleteMessageMenuAction;
