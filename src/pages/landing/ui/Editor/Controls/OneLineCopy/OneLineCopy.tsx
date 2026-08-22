import { useTranslations } from 'use-intl';
import { useClipboard } from '@mantine/hooks';
import { parse } from '@formatjs/icu-messageformat-parser';
import { IconCheck, IconLineDashed } from '@tabler/icons-react';
import { printAST } from '@formatjs/icu-messageformat-parser/printer.js';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import classes from './OneLineCopy.module.css';

const OneLineCopyControl = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();
  const clipboard = useClipboard({ timeout: 750 });

  const handleCopy = () => {
    const rawMessage = (editor?.getText() ?? '').trim();
    const parsedMessage = parse(rawMessage);
    const oneLineMessage = printAST(parsedMessage);
    return clipboard.copy(oneLineMessage);
  };

  return (
    <RichTextEditor.Control
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
