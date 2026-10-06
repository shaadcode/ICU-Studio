import { useTranslations } from 'use-intl';
import type { Editor } from '@tiptap/react';
import { RichTextEditor } from '@mantine/tiptap';
import { IconSparkleHighlight } from '@tabler/icons-react';

import { icuEditorStore } from '@/pages/landing/config/store/editor';

type Props = {
  editor: Editor;
};

const MessageFormattingControl = (props: Props) => {
  const t = useTranslations('editor');
  const formatContent = icuEditorStore.use.actions().formatContent;

  return (
    <RichTextEditor.Control
      title={t('controls.format')}
      aria-label={t('controls.format')}

      onClick={() => formatContent(props)}
    >
      <IconSparkleHighlight size={16} />
    </RichTextEditor.Control>
  );
};

export default MessageFormattingControl;
