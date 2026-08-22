import { useTranslations } from 'use-intl';
import { useClipboard } from '@mantine/hooks';
import { parse } from '@formatjs/icu-messageformat-parser';
import { IconCheck, IconFunction } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import classes from './TFunctionCopy.module.css';
import { collectVariables } from '@/shared/lib/icu/collectVariables';

const TFunctionCopyControl = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();
  const clipboard = useClipboard({ timeout: 750 });

  const handleCopy = () => {
    const rawMessage = (editor?.getText() ?? '').trim();
    const parsedMessage = parse(rawMessage);
    const variables = collectVariables(parsedMessage);

    if (!variables.keys.length) {
      return clipboard.copy(`t('')`);
    }
    return clipboard.copy(`t('', { ${variables.keys.join(', ')} })`);
  };

  return (
    <RichTextEditor.Control
      className={classes['control']}
      title={t('controls.tFunctionCopy')}
      aria-label={t('controls.tFunctionCopy')}
      mod={{ 'is-copied': clipboard.copied || undefined }}

      onClick={handleCopy}
    >
      {clipboard.copied
        ? <IconCheck size={16} color="var(--mantine-color-green-9)" />
        : <IconFunction size={16} />}
    </RichTextEditor.Control>
  );
};

export default TFunctionCopyControl;
