import { useEffect } from 'react';
import { useEditor } from '@tiptap/react';
import { useTranslations } from 'use-intl';
import type { EditorOptions } from '@tiptap/react';
import { useDebouncedCallback } from '@mantine/hooks';
import { Placeholder } from '@tiptap/extension-placeholder';

import { SpanMark } from '@/shared/lib/mantine';
import type { ParserError } from '@/shared/lib/icu/types';
import { icuEditorStore } from '../../config/store/editor';
import { DEBOUNCE_UPDATE_EDITOR } from '@/shared/lib/mantine/constant';
import { CustomHardBreak, StarterKitForICUEditor } from '@/shared/lib/tiptap';

export type UseHandleEditorParams = {
  placeholder?: string;
  onRenderMessage?: () => void;
  onMountEditor?: EditorOptions['onMount'];
  onUpdateEditor?: EditorOptions['onUpdate'];
  onParserError?: (error: ParserError) => void;
};

export const useHandleEditor = (rootParams: UseHandleEditorParams) => {
  const tCommon = useTranslations('common');
  const t = useTranslations('editor');
  const setEditorInstance = icuEditorStore.use.actions().setEditorInstance;
  const setVariables = icuEditorStore.use.actions().setVariables;
  const setFormatted = icuEditorStore.use.actions().setFormatted;
  const setIsEmpty = icuEditorStore.use.actions().setIsEmpty;
  const formatContent = icuEditorStore.use.actions().formatContent;
  const clearValidationError = icuEditorStore.use.actions().clearValidationError;

  const debouncedUpdate = useDebouncedCallback((params: Parameters<EditorOptions['onUpdate']>[0]) => {
    const textContent = params.editor.getText();
    setIsEmpty(!textContent.trim().length);
    setVariables([]);
    setFormatted(false);
    clearValidationError();
  }, DEBOUNCE_UPDATE_EDITOR);

  const editor = useEditor({
    parseOptions: { preserveWhitespace: 'full' },
    onMount: (params) => {
      rootParams.onMountEditor?.(params);
      formatContent({
        ...params,
        ...rootParams,
      });
    },
    onUpdate: (params) => {
      if (!params.transaction.getMeta('skipUpdate')) {
        debouncedUpdate(params);
      }
      rootParams.onUpdateEditor?.(params);
    },

    extensions: [
      StarterKitForICUEditor,
      Placeholder.configure({ placeholder: rootParams.placeholder ?? t('placeholder') }),
      SpanMark,
      CustomHardBreak,
    ],
  });

  useEffect(() => {
    if (editor) {
      setEditorInstance(editor);
    }
  }, [editor]);

  return {
    t,
    editor,
    tCommon,
  };
};
