import { attempt } from 'es-toolkit';
import type { Editor } from '@tiptap/react';

import { getLineRangeOffsetByOneLine } from '@/shared/lib/icu';
import type { ICUEditorStore } from '@/pages/landing/config/store/editor';

type Params = {
  editor: Editor;
  errorLocation: ICUEditorStore['errorLocation'];
  validationError: ICUEditorStore['validationError'];
};

export const generateErrorCodeSnippet = (params: Params) => {
  const { editor, errorLocation, validationError } = params;
  const [, snippetByLineNumber] = attempt(() => errorLocation && editor
    .state
    .doc
    .textBetween(errorLocation.lineRangeOffset.start, errorLocation.lineRangeOffset.end));

  const [, snippetByErrorOffset] = attempt(() => errorLocation && editor
    .state
    .doc
    .textBetween(errorLocation.start, errorLocation.end));

  const [, snippetByLineRange] = attempt(() => {
    if (!validationError) {
      return;
    }
    const lineOffset = getLineRangeOffsetByOneLine(editor, validationError.location.end.line);
    return lineOffset && editor
      .state
      .doc
      .textBetween(lineOffset.start, lineOffset.end);
  });

  if (validationError?.message === 'EXPECT_ARGUMENT_TYPE') {
    return ',';
  }

  return snippetByErrorOffset || snippetByLineNumber || snippetByLineRange || '...';
};
