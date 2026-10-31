import { useTranslations } from 'use-intl';
import { useClipboard } from '@mantine/hooks';
import { IconCheck, IconLineDashed } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import classes from './OneLineCopy.module.css';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

const OneLineCopyControl = () => {
  const t = useTranslations('editor');
  const isFormatted = icuEditorStore.use.isFormatted();
  const { editor } = useRichTextEditorContext();
  const clipboard = useClipboard({ timeout: 750 });

  const handleCopy = () => {
    const rawMessage = (editor?.getText() ?? '').trim();
    return clipboard.copy(rawMessage.replace(/\n/g, ''));
  };

  return (
    <RichTextEditor.Control
      disabled={!isFormatted}
      className={classes['control']}
      title={t('controls.oneLineCopy')}
      aria-label={t('controls.oneLineCopy')}
      mod={{ 'is-copied': clipboard.copied || undefined }}

      onClick={handleCopy}
    >
      {clipboard.copied
        ? <IconCheck size={16} color="var(--mantine-color-green-9)" />
        : <IconLineDashed size={16} />}
    </RichTextEditor.Control>
  );
};

export default OneLineCopyControl;
