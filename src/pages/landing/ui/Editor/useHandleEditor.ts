import { useEffect } from 'react';
import { useEditor } from '@tiptap/react';
import { useTranslations } from 'use-intl';
import { useViewportSize } from '@mantine/hooks';
import type { EditorOptions } from '@tiptap/react';
import { Placeholder } from '@tiptap/extension-placeholder';

import { SpanMark } from '@/shared/lib/mantine';
import type { ParserError } from '@/shared/lib/icu/types';
import { icuEditorStore } from '../../config/store/editor';
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
  const viewportSize = useViewportSize();
  const setEditorInstance = icuEditorStore.use.actions().setEditorInstance;
  const setVariables = icuEditorStore.use.actions().setVariables;
  const formatContent = icuEditorStore.use.actions().formatContent;

  const editor = useEditor({
    parseOptions: { preserveWhitespace: 'full' },
    onUpdate: (params) => {
      setVariables([]);
      rootParams.onUpdateEditor?.(params);
    },
    onMount: (params) => {
      rootParams.onMountEditor?.(params);
      formatContent({
        ...params,
        ...rootParams,
      });
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
      formatContent({ ...rootParams, editor });
    }
  }, [viewportSize]);

  useEffect(() => {
    setEditorInstance(editor);
  }, [editor]);

  return {
    t,
    editor,
    tCommon,
  };
};
