import { useEditor } from '@tiptap/react';
import { useTranslations } from 'use-intl';
import StarterKit from '@tiptap/starter-kit';
import { Box, Divider } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';

import classes from './Editor.module.css';
import SimpleCopyControl from './Controls/SimpleCopy/SimpleCopy';
import PrettyCopyControl from './Controls/PrettyCopy/PrettyCopy';
import OneLineCopyControl from './Controls/OneLineCopy/OneLineCopy';
import TFunctionCopyControl from './Controls/TFunctionCopy/TFunctionCopy';
import JSONPropertyCopy from './Controls/JSONPropertyCopy/JSONPropertyCopy';
import JSONPropertyPasteControl from './Controls/JSONPropertyPaste/JSONPropertyPaste';

const Editor = () => {
  const tCommon = useTranslations('common');
  const t = useTranslations('editor');
  const editor = useEditor({
    content: '',
    extensions: [
      Highlight,
      StarterKit,
      Placeholder.configure({ placeholder: t('placeholder') }),
    ],
  });
  return (
    <RichTextEditor h="100%" w="100%" editor={editor}>
      <RichTextEditor.Toolbar sticky>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
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
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default Editor;
