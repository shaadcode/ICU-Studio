import { MenuItem } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import type { MarkViewRendererProps } from '@tiptap/react';

import classes from './DeleteMessage.module.css';
import { icuEditorStore } from '@/pages/landing/config/store';

type Props = {
  view: MarkViewRendererProps;
};
const DeleteMessageMenuAction = (props: Props) => {
  const { mark, editor } = props.view;
  const getDelimiterRange = icuEditorStore.use.actions().getDelimiterRange;
  const handleDeleteMessage = () => {
    const referenceId = mark.attrs['data-reference-id'] as string;

    const messageRange = getDelimiterRange(referenceId);

    const from = messageRange?.open?.from;
    const to = messageRange?.close?.to;
    if (to && from) {
      editor.commands.deleteRange({ to, from });
    }
  };

  return (
    <MenuItem
      color="red"
      leftSection={<IconTrash size="80%" />}
      classNames={{ item: classes['menuItem'] }}

      onClick={handleDeleteMessage}
    >
      {'delete\r'}
    </MenuItem>
  );
};

export default DeleteMessageMenuAction;
