import { useTranslations } from 'use-intl';
import { useClipboard } from '@mantine/hooks';
import { Tooltip, MenuItem } from '@mantine/core';
import type { MarkViewRendererProps } from '@tiptap/react';
import { IconCheck, IconScissors } from '@tabler/icons-react';

import classes from './CutMessage.module.css';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

type Props = {
  tiptapMark: MarkViewRendererProps;
};
const CutMessageMenuAction = (props: Props) => {
  const { mark, editor } = props.tiptapMark;
  const t = useTranslations('common');
  const clipboard = useClipboard({ timeout: 500 });

  const getDelimiterRange = icuEditorStore.use.actions().getDelimiterRange;
  const handleDeleteMessage = () => {
    const referenceId = mark.attrs['data-reference-id'] as string;

    const messageRange = getDelimiterRange(referenceId);

    const from = messageRange?.open?.from;
    const to = messageRange?.close?.to;
    if (to && from) {
      const text = editor.view.state.doc.textBetween(from, to);
      editor.commands.deleteRange({ to, from });
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
