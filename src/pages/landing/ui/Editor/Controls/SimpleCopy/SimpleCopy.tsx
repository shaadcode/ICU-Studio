import { useTranslations } from 'use-intl';
import { useClipboard } from '@mantine/hooks';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import classes from './SimpleCopy.module.css';

const SimpleCopyControl = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();
  const clipboard = useClipboard({ timeout: 750 });

  return (
    <RichTextEditor.Control
      className={classes['control']}
      title={t('controls.simpleCopy')}
      aria-label={t('controls.simpleCopy')}
      mod={{ 'is-copied': clipboard.copied || undefined }}

      onClick={() => clipboard.copy(editor?.getText())}
    >
      {clipboard.copied
        ? <IconCheck size={16} color="var(--mantine-color-green-9)" />
        : <IconCopy size={16} />}
    </RichTextEditor.Control>
  );
};

export default SimpleCopyControl;
