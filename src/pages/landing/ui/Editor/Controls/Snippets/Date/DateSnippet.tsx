import { useTranslations } from 'use-intl';
import { IconCalendar } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import { extendInsertContent } from '@/shared/lib/tiptap';

const DateSnippet = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();

  const message = `{date, date, short}`;
  return (
    <RichTextEditor.Control
      title={t('controls.snippets.date')}
      aria-label={t('controls.snippets.date')}

      onClick={() => editor && extendInsertContent(editor)(message)}
    >
      <IconCalendar size={16} />
    </RichTextEditor.Control>
  );
};

export default DateSnippet;
