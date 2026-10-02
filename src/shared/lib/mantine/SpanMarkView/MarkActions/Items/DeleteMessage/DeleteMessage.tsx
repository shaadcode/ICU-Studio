import { useTranslations } from 'use-intl';
import { IconTrash } from '@tabler/icons-react';
import { Tooltip, MenuItem } from '@mantine/core';
import type { MarkViewRendererProps } from '@tiptap/react';

import classes from './DeleteMessage.module.css';
import { getDelimiterRange } from '../../../getDelimiterRange';
import { getMarkViewAttributes } from '@/shared/lib/icu/getMarkAttribute';

type Props = {
  tiptapMark: MarkViewRendererProps;
};
const DeleteMessageMenuAction = (props: Props) => {
  const { editor } = props.tiptapMark;
  const attrs = getMarkViewAttributes(props.tiptapMark);
  const t = useTranslations('common');
  const handleDeleteMessage = () => {
    const messageRange = getDelimiterRange({
      editor,
      referenceId: attrs['data-reference-id'],
    });

    const from = messageRange.open.from;
    const to = messageRange.close.to;

    if (to && from) {
      editor.chain().deleteRange({ to, from }).run();
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
