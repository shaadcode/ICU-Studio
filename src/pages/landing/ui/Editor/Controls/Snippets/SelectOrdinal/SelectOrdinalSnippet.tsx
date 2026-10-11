import { useTranslations } from 'use-intl';
import { IconListLetters } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import { extendInsertContent } from '@/shared/lib/tiptap';

const SelectOrdinalSnippet = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();

  const message = `{count, selectordinal,
  one {#}
  two {#}
  other {#}
}`;
  return (
    <RichTextEditor.Control
      title={t('controls.snippets.select')}
      aria-label={t('controls.snippets.select')}

      onClick={() => editor && extendInsertContent(editor)(message)}
    >
      <IconListLetters size={16} />
    </RichTextEditor.Control>
  );
};

export default SelectOrdinalSnippet;
