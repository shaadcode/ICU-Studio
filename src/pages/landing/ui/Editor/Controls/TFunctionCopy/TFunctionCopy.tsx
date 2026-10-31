import { useTranslations } from 'use-intl';
import { useClipboard } from '@mantine/hooks';
import { RichTextEditor } from '@mantine/tiptap';
import { IconCheck, IconFunction } from '@tabler/icons-react';

import classes from './TFunctionCopy.module.css';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

const TFunctionCopyControl = () => {
  const isFormatted = icuEditorStore.use.isFormatted();
  const variables = icuEditorStore.use.variables();

  const t = useTranslations('editor');
  const clipboard = useClipboard({ timeout: 750 });

  const handleCopy = () => {
    const variablesName = variables.map(variable => variable.name);
    const hasVariable = !!variablesName.length;
    return clipboard.copy(`t(''${hasVariable
      ? `, { ${variablesName.join(', ')} }`
      : ''})`);
  };

  return (
    <RichTextEditor.Control
      disabled={!isFormatted}
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
