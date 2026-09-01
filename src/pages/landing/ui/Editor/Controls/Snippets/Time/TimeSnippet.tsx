import { useTranslations } from 'use-intl';
import { IconClock } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import { extendInsertContent } from '@/shared/lib/tiptap';

const TimeSnippet = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();

  const message = `{time, time, short}`;
  return (
    <RichTextEditor.Control
      title={t('controls.snippets.time')}
      aria-label={t('controls.snippets.time')}

      onClick={() => editor && extendInsertContent(editor)(message)}
    >
      <IconClock size={16} />
    </RichTextEditor.Control>
  );
};

export default TimeSnippet;
