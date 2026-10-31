import { useTranslations } from 'use-intl';
import { useClipboard } from '@mantine/hooks';
import { IconCheck, IconCodeDots } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import classes from './JSONPropertyCopy.module.css';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

const JSONPropertyCopy = () => {
  const isFormatted = icuEditorStore.use.isFormatted();
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();
  const clipboard = useClipboard({ timeout: 750 });

  const handleCopy = () => {
    const rawMessage = (editor?.getText() ?? '').trim();
    clipboard.copy(`"": "${rawMessage.replace(/\n/g, '')}",`);
  };

  return (
    <RichTextEditor.Control
      disabled={!isFormatted}
      className={classes['control']}
      title={t('controls.jsonPropertyCopy')}
      aria-label={t('controls.jsonPropertyCopy')}
      mod={{ 'is-copied': clipboard.copied || undefined }}

      onClick={handleCopy}
    >
      {clipboard.copied
        ? <IconCheck size={16} color="var(--mantine-color-green-9)" />
        : <IconCodeDots size={16} />}
    </RichTextEditor.Control>
  );
};

export default JSONPropertyCopy;
