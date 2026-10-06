import { useEffect } from 'react';
import { useTranslations } from 'use-intl';
import type { Editor } from '@tiptap/react';
import { useDebouncedCallback } from '@mantine/hooks';

import { icuEditorStore } from '@/pages/landing/config/store/editor';
import { messagesStore } from '@/pages/landing/config/store/messages';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';

export function useMessageMainSectionHandlers() {
  const t = useTranslations('messages');
  const initialContent = messagesStore.use.initialContent();
  const updateDirty = messagesStore.use.actions().updateDirty;
  const selectedMessage = messagesStore.use.selectedMessage();
  const editorInstance = icuEditorStore.use.editorInstance();

  useEffect(() => {
    if (editorInstance && initialContent) {
      editorInstance
        .chain()
        .setContent(
          initialContent,
          { emitUpdate: false, parseOptions: { preserveWhitespace: 'full' } },
        )
        .run();
    }
  }, [initialContent, editorInstance]);

  const checkIsDirty = useDebouncedCallback(
    (editor: Editor) => {
      initialContent && updateDirty(editor.getText() !== initialContent);
    },
    BOUNCE_UPDATE_VARIABLE_VALUE,
  );

  return {
    t,
    checkIsDirty,
    selectedMessage,
  };
}
