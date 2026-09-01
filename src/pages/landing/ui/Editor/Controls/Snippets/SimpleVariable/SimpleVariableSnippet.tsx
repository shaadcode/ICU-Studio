import { useTranslations } from 'use-intl';
import { IconVariable } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import { extendInsertContent } from '@/shared/lib/tiptap';

const SimpleVariableSnippet = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();

  const message = `{variable}`;
  return (
    <RichTextEditor.Control
      title={t('controls.snippets.simpleVariable')}
      aria-label={t('controls.snippets.simpleVariable')}

      onClick={() => editor && extendInsertContent(editor)(message)}
    >
      <IconVariable size={16} />
    </RichTextEditor.Control>
  );
};

export default SimpleVariableSnippet;
