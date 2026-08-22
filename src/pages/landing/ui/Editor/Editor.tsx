import { useEditor } from '@tiptap/react';
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

const Editor = () => {
  const editor = useEditor({
    content: 'hello',
    extensions: [
      Highlight,
      StarterKit,
      Placeholder.configure({ placeholder: 'hello' }),
    ],
  });
  return (
    <RichTextEditor w="100%" editor={editor}>
      <RichTextEditor.Toolbar sticky>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
        <Box className={classes['copyControlsContainer']}>
          <Divider label="copy" />
          <RichTextEditor.ControlsGroup style={{ backgroundColor: 'transparent' }}>
            <SimpleCopyControl />
            <OneLineCopyControl />
            <PrettyCopyControl />
            <JSONPropertyCopy />
            <TFunctionCopyControl />
          </RichTextEditor.ControlsGroup>
        </Box>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default Editor;
