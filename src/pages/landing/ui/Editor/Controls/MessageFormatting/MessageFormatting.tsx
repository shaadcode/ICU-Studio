import { useTranslations } from 'use-intl';
import type { Editor } from '@tiptap/react';
import { RichTextEditor } from '@mantine/tiptap';
import { IconSparkleHighlight } from '@tabler/icons-react';

import { useFormatMessage } from '../../useFormatMessage';

type Props = {
  editor: Editor;
};

const MessageFormattingControl = (props: Props) => {
  const t = useTranslations('editor');
  const formatHandlers = useFormatMessage({ editor: props.editor });

  return (
    <RichTextEditor.Control
      title={t('controls.format')}
      aria-label={t('controls.format')}

      onClick={formatHandlers.formatMessage}
    >
      <IconSparkleHighlight size={16} />
    </RichTextEditor.Control>
  );
};

export default MessageFormattingControl;
