import { useTranslations } from 'use-intl';
import { IconSparkles2 } from '@tabler/icons-react';
import { parse } from '@formatjs/icu-messageformat-parser';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

import { createHtml } from './createHtml';

const FormatMessageControl = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();
  const handleFormat = () => {
    const rawMessage = editor?.getText() ?? '';
    const parsed = parse(rawMessage);
    const html = createHtml(parsed);
    editor?.commands.setContent(
      html.outerHTML,
      { parseOptions: { preserveWhitespace: 'full' } },
    );
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
