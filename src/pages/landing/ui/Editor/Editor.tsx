import type { ReactNode } from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import type { UseEditorOptions } from '@tiptap/react';
import { Box, Group, Stack, Divider } from '@mantine/core';

import { useHandleEditor } from './useHandleEditor';
import TestVariables from './TestVariables/TestVariables';
import TagSnippet from './Controls/Snippets/Tag/TagSnippet';
import DateSnippet from './Controls/Snippets/Date/DateSnippet';
import TimeSnippet from './Controls/Snippets/Time/TimeSnippet';
import SimpleCopyControl from './Controls/SimpleCopy/SimpleCopy';
import PrettyCopyControl from './Controls/PrettyCopy/PrettyCopy';
import PoundSnippet from './Controls/Snippets/Pound/PoundSnippet';
import ValidationStatus from './ValidationStatus/ValidationStatus';
import OneLineCopyControl from './Controls/OneLineCopy/OneLineCopy';
import NumberSnippet from './Controls/Snippets/Number/NumberSnippet';
import SelectSnippet from './Controls/Snippets/Select/SelectSnippet';
import PluralSnippet from './Controls/Snippets/Plural/PluralSnippet';
import VariableStatistic from './VariableStatistic/VariableStatistic';
import TFunctionCopyControl from './Controls/TFunctionCopy/TFunctionCopy';
import JSONPropertyCopy from './Controls/JSONPropertyCopy/JSONPropertyCopy';
import ValidationErrorBubble from './ValidationErrorBubble/ValidationErrorBubble';
import JSONPropertyPasteControl from './Controls/JSONPropertyPaste/JSONPropertyPaste';
import './Editor.module.css';
import SimpleVariableSnippet from './Controls/Snippets/SimpleVariable/SimpleVariableSnippet';

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
  const editorHandler = useHandleEditor({ ...props });

  if (props.custom) {
    return (
      <RichTextEditor h="100%" w="100%" editor={editorHandler.editor}>
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
    <Stack w="100%" h="100%">
      <RichTextEditor h="100%" w="100%" editor={editorHandler.editor}>
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
          </Group>

          <Group style={{ justifySelf: 'flex-end' }}>
            {/* <FormatMessageControl /> */}
            <ValidationStatus />

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </Group>
          <Divider mx="-16px" style={{ gridColumn: '1/3' }} />
          <VariableStatistic />
        </RichTextEditor.Toolbar>

        <ValidationErrorBubble editor={editorHandler.editor} />
        <RichTextEditor.Content px="lg" />

      </RichTextEditor>

      <TestVariables />
    </Stack>
  );
};

export default ICUEditor;
