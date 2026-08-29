import { useTranslations } from 'use-intl';
import { IconSparkles2 } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import { minimalParser } from '@/shared/lib/icu';
import { extendSetContent } from '@/shared/lib/tiptap';
import { extractInfoAndHtml } from '@/shared/lib/icu/createHtml/createHtml';

const FormatMessageControl = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();
  const handleFormat = () => {
    if (!editor) {
      throw new Error('editor is undefined');
    }

    const rawMessage = editor?.getText() ?? '';
    const parsed = minimalParser(rawMessage);
    const html = extractInfoAndHtml(parsed, { withFormatting: true });
    extendSetContent(editor)(html.outerHTML);
  };
  return (
    <RichTextEditor.Control
      title={t('controls.formatMessage')}
      aria-label={t('controls.formatMessage')}

      onClick={handleFormat}
    >
      <IconSparkles2 size={16} />
    </RichTextEditor.Control>
  );
};

export default FormatMessageControl;
