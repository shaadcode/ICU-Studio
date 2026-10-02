import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useEditor } from '@tiptap/react';
import { useTranslations } from 'use-intl';
import type { Transaction } from '@tiptap/pm/state';
import { Placeholder } from '@tiptap/extension-placeholder';
import type { Editor, UseEditorOptions } from '@tiptap/react';
import { useViewportSize, useDebouncedCallback } from '@mantine/hooks';

import { SpanMark } from '@/shared/lib/mantine';
import { minimalParser } from '@/shared/lib/icu';
import { icuEditorStore } from '../../config/store/editor';
import { updateIcuEditor } from '@/shared/lib/tiptap/updateIcuEditor';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';
import { CustomHardBreak, StarterKitForICUEditor } from '@/shared/lib/tiptap';

type Params = {
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

export const useHandleEditor = (params: Params) => {
  const tCommon = useTranslations('common');

  const t = useTranslations('editor');
  const viewportSize = useViewportSize();
  const setValidationError = icuEditorStore.use.actions().setValidationError;
  const setMessage = icuEditorStore.use.actions().setMessage;
  const setParsedMessage = icuEditorStore.use.actions().setParsedMessage;
  const setVariables = icuEditorStore.use.actions().setVariables;
  const clearMessageState = icuEditorStore.use.actions().clearMessageState;
  const clearValidationError = icuEditorStore.use.actions().clearValidationError;
  const validationError = icuEditorStore.use.validationError();
  const updateContent = useDebouncedCallback(
    (
      editor: Editor,
      transaction?: Transaction,
    ) => updateIcuEditor({
      editor,
      setMessage,
      transaction,
      setVariables,
      validationError,
      setParsedMessage,
      clearMessageState,
      setValidationError,
      clearValidationError,
      parser: minimalParser,
    }),
    BOUNCE_UPDATE_VARIABLE_VALUE,
  );

  const editor = useEditor({
    parseOptions: { preserveWhitespace: 'full' },
    onUpdate: () => {
      setVariables([]);
    },
    onMount: ({ editor }) => {
      params.custom?.onMount?.({ editor });
      updateContent(editor);
    },
    // onSelectionUpdate: ({ editor }) => console.log(editor.state.selection.$anchor.pos),
    extensions: [
      StarterKitForICUEditor,
      Placeholder.configure({ placeholder: t('placeholder') }),
      SpanMark,
      CustomHardBreak,
    ],
    ...params.custom?.customEditorConfig,
  });

  useEffect(() => {
    updateContent(editor);
  }, [viewportSize]);

  return {
    t,
    editor,
    tCommon,
  };
};
