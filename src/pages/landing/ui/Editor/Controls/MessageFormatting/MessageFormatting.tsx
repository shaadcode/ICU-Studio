import { useTranslations } from 'use-intl';
import type { Editor } from '@tiptap/react';
import { useHotkeys } from '@mantine/hooks';
import { RichTextEditor } from '@mantine/tiptap';
import { IconSparkleHighlight } from '@tabler/icons-react';

import { hotkeys } from '@/shared/config/mantine/hotKeys';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

type Props = {
  editor: Editor;
};

const MessageFormattingControl = (props: Props) => {
  const t = useTranslations('editor');
  const formatContent = icuEditorStore.use.actions().formatContent;

  useHotkeys(
    [
      [hotkeys.editor.formatting, () => formatContent(props)],
    ],
    [],
    true,
  );

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
