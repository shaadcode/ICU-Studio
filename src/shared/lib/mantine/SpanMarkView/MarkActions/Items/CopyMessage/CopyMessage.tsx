import { useTranslations } from 'use-intl';
import { useClipboard } from '@mantine/hooks';
import { Tooltip, MenuItem } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';

import classes from './CopyMessage.module.css';
import { getDelimiterRange } from '@/shared/lib/tiptap';
import type { SharedActionProps } from '../../VariableActions';

const CopyMessageMenuAction = (props: SharedActionProps) => {
  const t = useTranslations('common');
  const clipboard = useClipboard({ timeout: 500 });

  const handleDeleteMessage = () => {
    const messageRange = getDelimiterRange(props);

    const from = messageRange?.open?.from;
    const to = messageRange?.close?.to;
    if (to && from) {
      const text = props.editor.view.state.doc.textBetween(from, to);
      clipboard.copy(text);
    }
  };

  return (
    <Tooltip label={t('copy')} classNames={{ tooltip: classes['tooltip'] }}>
      <MenuItem
        color={clipboard.copied ? 'green' : undefined}
        mod={{ 'is-copied': clipboard.copied || undefined }}
        classNames={{
          item: classes['menuItem'],
          itemLabel: classes['menuItemLabel'],
        }}

        onClick={handleDeleteMessage}
      >
        {clipboard.copied
          ? <IconCheck size={17} color="var(--mantine-color-green-9)" />
          : <IconCopy size={17} />}
      </MenuItem>
    </Tooltip>
  );
};

export default CopyMessageMenuAction;
