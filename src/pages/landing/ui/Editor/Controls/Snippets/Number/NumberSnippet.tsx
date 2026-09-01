import { useTranslations } from 'use-intl';
import { IconNumbers } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import { extendInsertContent } from '@/shared/lib/tiptap';

const NumberSnippet = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();

  const message = `{value, number}`;
  return (
    <RichTextEditor.Control
      title={t('controls.snippets.number')}
      aria-label={t('controls.snippets.number')}

      onClick={() => editor && extendInsertContent(editor)(message)}
    >
      <IconNumbers size={16} />
    </RichTextEditor.Control>
  );
};

export default NumberSnippet;
