import { useTranslations } from 'use-intl';
import { IconTrash } from '@tabler/icons-react';
import { Tooltip, MenuItem } from '@mantine/core';
import type { MarkViewRendererProps } from '@tiptap/react';

import classes from './DeleteMessage.module.css';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

type Props = {
  tiptapMark: MarkViewRendererProps;
};
const DeleteMessageMenuAction = (props: Props) => {
  const { mark, editor } = props.tiptapMark;
  const t = useTranslations('common');
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
    <Tooltip label={t('delete')} classNames={{ tooltip: classes['tooltip'] }}>
      <MenuItem
        color="red"
        classNames={{
          item: classes['menuItem'],
          itemLabel: classes['menuItemLabel'],
        }}

        onClick={handleDeleteMessage}
      >
        <IconTrash size="17px" />
      </MenuItem>
    </Tooltip>
  );
};

export default DeleteMessageMenuAction;
