import { attempt } from 'es-toolkit';
import type { Editor } from '@tiptap/react';

import type { ICUEditorStore } from '@/pages/landing/config/store/editor';

type Params = {
  editor: Editor;
  errorLocation: ICUEditorStore['errorLocation'];
  validationError: ICUEditorStore['validationError'];
};

export const generateErrorCodeSnippet = (params: Params) => {
  const { editor, errorLocation, validationError } = params;
  if (!errorLocation) {
    return '...';
  }
  const [, snippetByLineNumber] = attempt(() => editor
    .state
    .doc
    .textBetween(errorLocation.lineRangeOffset.start, errorLocation.lineRangeOffset.end));

  const [, snippetByErrorOffset] = attempt(() => editor
    .state
    .doc
    .textBetween(errorLocation.start, errorLocation.end));

  if (validationError?.message === 'EXPECT_ARGUMENT_TYPE') {
    return ',';
  }

  return snippetByErrorOffset || snippetByLineNumber || '...';
};
