import { RichTextEditor } from '@mantine/tiptap';
import { Box, Group, Divider, ScrollAreaAutosize } from '@mantine/core';

import { useHandleEditor } from './useHandleEditor';
import TagSnippet from './Controls/Snippets/Tag/TagSnippet';
import type { UseHandleEditorParams } from './useHandleEditor';
import DateSnippet from './Controls/Snippets/Date/DateSnippet';
import TimeSnippet from './Controls/Snippets/Time/TimeSnippet';
import SimpleCopyControl from './Controls/SimpleCopy/SimpleCopy';
import PrettyCopyControl from './Controls/PrettyCopy/PrettyCopy';
import PoundSnippet from './Controls/Snippets/Pound/PoundSnippet';
import OneLineCopyControl from './Controls/OneLineCopy/OneLineCopy';
import NumberSnippet from './Controls/Snippets/Number/NumberSnippet';
import SelectSnippet from './Controls/Snippets/Select/SelectSnippet';
import PluralSnippet from './Controls/Snippets/Plural/PluralSnippet';
import TFunctionCopyControl from './Controls/TFunctionCopy/TFunctionCopy';
import JSONPropertyCopy from './Controls/JSONPropertyCopy/JSONPropertyCopy';
import './Editor.module.css';
import JSONPropertyPasteControl from './Controls/JSONPropertyPaste/JSONPropertyPaste';
import MessageFormattingControl from './Controls/MessageFormatting/MessageFormatting';
import SimpleVariableSnippet from './Controls/Snippets/SimpleVariable/SimpleVariableSnippet';

const ICUEditor = (props: UseHandleEditorParams) => {
  const editorHandler = useHandleEditor({ ...props });

  return (
    <RichTextEditor
      h="100%"
      w="100%"
      display="flex"
      editor={editorHandler.editor}
      style={{ overflow: 'hidden', flexDirection: 'column' }}
    >
      <RichTextEditor.Toolbar
        sticky
        style={{
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <Group style={{ justifySelf: 'flex-start' }}>
          <Box>
            <Divider label={editorHandler.tCommon('copy')} />
            <RichTextEditor.ControlsGroup style={{ backgroundColor: 'transparent' }}>
              <SimpleCopyControl />
              <OneLineCopyControl />
              <PrettyCopyControl />
              <JSONPropertyCopy />
              <TFunctionCopyControl />
            </RichTextEditor.ControlsGroup>
          </Box>

          <Box>
            <Divider label={editorHandler.tCommon('paste')} />
            <RichTextEditor.ControlsGroup style={{ backgroundColor: 'transparent' }}>
              <JSONPropertyPasteControl />
            </RichTextEditor.ControlsGroup>
          </Box>

          <Box>
            <Divider label={editorHandler.tCommon('snippets')} />
            <RichTextEditor.ControlsGroup style={{ backgroundColor: 'transparent' }}>
              <SimpleVariableSnippet />
              <NumberSnippet />
              <DateSnippet />
              <TimeSnippet />
              <SelectSnippet />
              <PluralSnippet />
              <PoundSnippet />
              <TagSnippet />
            </RichTextEditor.ControlsGroup>
          </Box>

          <MessageFormattingControl editor={editorHandler.editor} />
        </Group>

        <Group style={{ justifySelf: 'flex-end' }}>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </Group>
      </RichTextEditor.Toolbar>

      <ScrollAreaAutosize h="100%">
        <RichTextEditor.Content
          px="lg"
          h="100%"
          pos="relative"
        />
      </ScrollAreaAutosize>

    </RichTextEditor>
  );
};

export default ICUEditor;
