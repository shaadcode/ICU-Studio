import type { Editor } from '@tiptap/react';

import { minimalParser } from '@/shared/lib/icu';
import { icuEditorStore } from '../../config/store/editor';
import { updateIcuEditor } from '@/shared/lib/tiptap/updateIcuEditor';

type Params = {
  editor: Editor;
};

export const useFormatMessage = (params: Params) => {
  const setValidationError = icuEditorStore.use.actions().setValidationError;
  const setMessage = icuEditorStore.use.actions().setMessage;
  const setParsedMessage = icuEditorStore.use.actions().setParsedMessage;
  const setVariables = icuEditorStore.use.actions().setVariables;
  const clearMessageState = icuEditorStore.use.actions().clearMessageState;
  const clearValidationError = icuEditorStore.use.actions().clearValidationError;
  const validationError = icuEditorStore.use.validationError();

  return {
    formatMessage: async () => await updateIcuEditor({
      setMessage,
      setVariables,
      validationError,
      setParsedMessage,
      clearMessageState,
      setValidationError,
      clearValidationError,
      editor: params.editor,
      parser: minimalParser,
    }),
  };
};
