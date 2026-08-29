import parse from 'format-message-parse';
import print from 'format-message-print';
import { useTranslations } from 'use-intl';
import { useClipboard } from '@mantine/hooks';
import { IconCheck, IconSparkles } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import classes from './PrettyCopy.module.css';
import { icuEditorStore } from '@/pages/landing/config/store';

const PrettyCopyControl = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();
  const clipboard = useClipboard({ timeout: 750 });
  const parserError = icuEditorStore.use.parserError();

  const handleCopy = () => {
    const rawMessage = (editor?.getText() ?? '').trim();
    const parsedMessage = parse(rawMessage);
    const prettyMessage = print(parsedMessage);

    return clipboard.copy(prettyMessage);
  };

  return (
    <RichTextEditor.Control
      disabled={!!parserError}
      className={classes['control']}
      title={t('controls.prettyCopy')}
      aria-label={t('controls.prettyCopy')}
      mod={{ 'is-copied': clipboard.copied || undefined }}

      onClick={handleCopy}
    >
      {clipboard.copied
        ? <IconCheck size={16} color="var(--mantine-color-green-9)" />
        : <IconSparkles size={16} />}
    </RichTextEditor.Control>
  );
};

export default PrettyCopyControl;
