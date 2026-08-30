import type { ReactNode } from 'react';
import { useEditor } from '@tiptap/react';
import { useTranslations } from 'use-intl';
import { RichTextEditor } from '@mantine/tiptap';
import type { UseEditorOptions } from '@tiptap/react';
import { useDebouncedCallback } from '@mantine/hooks';
import Placeholder from '@tiptap/extension-placeholder';
import { Box, Group, Stack, Divider } from '@mantine/core';

import classes from './Editor.module.css';
import { icuEditorStore } from '../../config/store';
import TestVariables from './TestVariables/TestVariables';
import { StarterKitForICUEditor } from '@/shared/lib/tiptap';
import SimpleCopyControl from './Controls/SimpleCopy/SimpleCopy';
import PrettyCopyControl from './Controls/PrettyCopy/PrettyCopy';
import ValidationStatus from './ValidationStatus/ValidationStatus';
import OneLineCopyControl from './Controls/OneLineCopy/OneLineCopy';
import { SpanMark, BOUNCE_UPDATE_EDITOR } from '@/shared/lib/mantine';
import { updateIcuEditor } from '@/shared/lib/tiptap/updateIcuEditor';
import TFunctionCopyControl from './Controls/TFunctionCopy/TFunctionCopy';
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

  const setValidationError = icuEditorStore.use.actions().setValidationError;
  const setMessage = icuEditorStore.use.actions().setMessage;
  const setParsedMessage = icuEditorStore.use.actions().setParsedMessage;
  const setVariables = icuEditorStore.use.actions().setVariables;
  const initialVariablesValues = icuEditorStore.use.actions().initialVariablesValues;
  const updateContent = useDebouncedCallback(updateIcuEditor, BOUNCE_UPDATE_EDITOR);

  const editor = useEditor({
    parseOptions: { preserveWhitespace: 'full' },
    extensions: [
      StarterKitForICUEditor,
      Placeholder.configure({ placeholder: t('placeholder') }),
      SpanMark,
    ],
    onUpdate: ({ editor }) => {
      updateContent({
        editor,
        setMessage,
        setVariables,
        setParsedMessage,
        setValidationError,
        initialVariablesValues,
      });
    },
    onMount: ({ editor }) => {
      props.custom?.onMount?.({ editor });
      updateContent({
        editor,
        setMessage,
        setVariables,
        setParsedMessage,
        setValidationError,
        initialVariablesValues,
      });
    },
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
    <Stack h="100%" w="100%">
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

            <Box className={classes['copyControlsContainer']}>
              <Divider label={tCommon('snippets')} />
              <RichTextEditor.ControlsGroup style={{ backgroundColor: 'transparent' }}>
                <JSONPropertyPasteControl />
              </RichTextEditor.ControlsGroup>
            </Box>
          </Group>
          <Group>
            {/* <FormatMessageControl /> */}
            <ValidationStatus />

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </Group>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />

      </RichTextEditor>

      <TestVariables />
    </Stack>
  );
};

export default ICUEditor;
