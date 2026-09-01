import { useTranslations } from 'use-intl';
import { IconHash } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import { extendInsertContent } from '@/shared/lib/tiptap';

const PoundSnippet = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();

  const message = `#`;
  return (
    <RichTextEditor.Control
      title={t('controls.snippets.pound')}
      aria-label={t('controls.snippets.pound')}

      onClick={() => editor && extendInsertContent(editor)(message)}
    >
      <IconHash size={16} />
    </RichTextEditor.Control>
  );
};

export default PoundSnippet;
