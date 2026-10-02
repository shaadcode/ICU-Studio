import { useTranslations } from 'use-intl';
import { IconListNumbers } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import { extendInsertContent } from '@/shared/lib/tiptap';

const PluralSnippet = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();
  const message = `{variable, plural,
  =0 {text}
  one {text}
  other {# text}
}`;

  const handleClick = () => {
    if (!editor) {
      return;
    }

    // const prevCursorPosition = editor.state.selection.$anchor.pos;

    extendInsertContent(editor)(message);
    // editor.chain().focus(prevCursorPosition + message.length).run();
  };
  return (
    <RichTextEditor.Control
      title={t('controls.snippets.plural')}
      aria-label={t('controls.snippets.plural')}

      onClick={handleClick}
    >
      <IconListNumbers size={16} />
    </RichTextEditor.Control>
  );
};

export default PluralSnippet;
