import type { ReactNode } from 'react';
import { useEditor } from '@tiptap/react';
import { useTranslations } from 'use-intl';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import { Box, Group, Divider } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import Placeholder from '@tiptap/extension-placeholder';
import type { Editor, UseEditorOptions } from '@tiptap/react';

import classes from './Editor.module.css';
import { textToHtml } from '@/shared/lib/icu/textToHtml';
import SimpleCopyControl from './Controls/SimpleCopy/SimpleCopy';
import PrettyCopyControl from './Controls/PrettyCopy/PrettyCopy';
import OneLineCopyControl from './Controls/OneLineCopy/OneLineCopy';
import { SpanMark, BOUNCE_UPDATE_EDITOR } from '@/shared/lib/mantine';
import TFunctionCopyControl from './Controls/TFunctionCopy/TFunctionCopy';
import FormatMessageControl from './Controls/FormatMessage/FormatMessage';
import JSONPropertyCopy from './Controls/JSONPropertyCopy/JSONPropertyCopy';
import JSONPropertyPasteControl from './Controls/JSONPropertyPaste/JSONPropertyPaste';

type Props = {
/**
 * for custom config
 */
  custom?: {
    toolBarChildren?: ReactNode;
    onMount?: UseEditorOptions['onMount'];
    /**
     * override default config
     */
    customEditorConfig?: UseEditorOptions;
  };

};

const ICUEditor = (props: Props) => {
  const tCommon = useTranslations('common');
  const t = useTranslations('editor');

  const updateContent = useDebouncedCallback((editor: Editor) => {
    const prevCursorPosition = editor.state.selection.$anchor.pos;
    const html = textToHtml(editor.getText());
    editor.commands.setContent(
      html.outerHTML,
      { parseOptions: { preserveWhitespace: true } },
    );
    editor.commands.setTextSelection(prevCursorPosition);
  }, BOUNCE_UPDATE_EDITOR);

  const editor = useEditor({
    content: '',
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => {
      updateContent(editor);
    },
    onMount: ({ editor }) => {
      updateContent(editor);
      props.custom?.onMount?.({ editor });
    },
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: t('placeholder') }),
      SpanMark,
    ],
    ...props.custom?.customEditorConfig,
  });

  if (props.custom) {
    return (
      <RichTextEditor h="100%" w="100%" editor={editor}>
        <RichTextEditor.Toolbar
          sticky
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          {props.custom.toolBarChildren}
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />

      </RichTextEditor>
    );
  }

  return (
    <RichTextEditor h="100%" w="100%" editor={editor}>
      <RichTextEditor.Toolbar
        sticky
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >

        <Group>
          <Box className={classes['copyControlsContainer']}>
            <Divider label={tCommon('copy')} />
            <RichTextEditor.ControlsGroup style={{ backgroundColor: 'transparent' }}>
              <SimpleCopyControl />
              <OneLineCopyControl />
              <PrettyCopyControl />
              <JSONPropertyCopy />
              <TFunctionCopyControl />
            </RichTextEditor.ControlsGroup>
          </Box>

          <Box className={classes['copyControlsContainer']}>
            <Divider label={tCommon('paste')} />
            <RichTextEditor.ControlsGroup style={{ backgroundColor: 'transparent' }}>
              <JSONPropertyPasteControl />
            </RichTextEditor.ControlsGroup>
          </Box>
        </Group>
        <Group>
          <FormatMessageControl />
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </Group>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default ICUEditor;
