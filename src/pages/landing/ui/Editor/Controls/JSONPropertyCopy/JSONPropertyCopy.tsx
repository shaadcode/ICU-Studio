import { useTranslations } from 'use-intl';
import { useClipboard } from '@mantine/hooks';
import { IconCheck, IconCodeDots } from '@tabler/icons-react';
import { printAST } from '@formatjs/icu-messageformat-parser/printer.js';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import { minimalParser } from '@/shared/lib/icu';
import classes from './JSONPropertyCopy.module.css';
import { icuEditorStore } from '@/pages/landing/config/store';

const JSONPropertyCopy = () => {
  const parserError = icuEditorStore.use.parserError();
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();
  const clipboard = useClipboard({ timeout: 750 });

  const handleCopy = () => {
    const rawMessage = (editor?.getText() ?? '').trim();
    const [_error, parsedMessage] = minimalParser(rawMessage);

    if (parsedMessage) {
      const oneLineMessage = printAST(parsedMessage);

      return clipboard.copy(`"": "${oneLineMessage}",`);
    }
  };

  return (
    <RichTextEditor.Control
      disabled={!!parserError}
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
