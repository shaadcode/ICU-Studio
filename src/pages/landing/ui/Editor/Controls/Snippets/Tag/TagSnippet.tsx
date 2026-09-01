import { useTranslations } from 'use-intl';
import { IconCode } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import { extendInsertContent } from '@/shared/lib/tiptap';

const TagSnippet = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();

  const message = `<TagName>children</TagName>`;
  return (
    <RichTextEditor.Control
      title={t('controls.snippets.tag')}
      aria-label={t('controls.snippets.tag')}

      onClick={() => editor && extendInsertContent(editor)(message)}
    >
      <IconCode size={16} />
    </RichTextEditor.Control>
  );
};

export default TagSnippet;
