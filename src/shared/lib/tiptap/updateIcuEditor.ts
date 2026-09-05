import type { Remote } from 'comlink';
import type { Editor } from '@tiptap/react';

import { createHtml } from '../icu';
import type { minimalParser } from '../icu';
import { extendSetContent } from './extendSetContent';
import type { ICUEditorStore } from '@/pages/landing/config/store';

type Params = {
  editor: Editor;
  setMessage: ICUEditorStore['actions']['setMessage'];
  setVariables: ICUEditorStore['actions']['setVariables'];
  parser: typeof minimalParser | Remote<typeof minimalParser>;
  setParsedMessage: ICUEditorStore['actions']['setParsedMessage'];
  clearMessageState: ICUEditorStore['actions']['clearMessageState'];
  setValidationError: ICUEditorStore['actions']['setValidationError'];
};

/**
 * IIFE function
 */
export const updateIcuEditor = async (params: Params) => {
  params.clearMessageState();
  const message = params.editor.getText();
  const prevCursorPosition = params.editor.state.selection.$anchor.pos;
  params.setMessage(message);
  const [error, parsedMessage] = await params.parser(message);
  if (!parsedMessage) {
    params.setVariables([]);

    return params.setValidationError(error);
  }

  const html = createHtml(parsedMessage, { withFormatting: true });
  params.setValidationError(undefined);
  if (html.children.length) {
    extendSetContent(params.editor)(html.outerHTML);
    params.setParsedMessage(parsedMessage);
    params.setVariables(parsedMessage);
    params.editor.commands.setTextSelection(prevCursorPosition);
  }
};
