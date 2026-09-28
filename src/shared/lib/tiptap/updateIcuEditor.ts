import type { Remote } from 'comlink';
import type { Editor } from '@tiptap/react';
import type { Transaction } from '@tiptap/pm/state';

import { createHtml } from '../icu';
import type { minimalParser } from '../icu';
import { isUndoRedoTransaction } from './predicates';
import type { ICUEditorStore } from '@/pages/landing/config/store/editor';
import { extendSetContent, extendInsertContent } from './extendSetContent';

type Params = {
  editor: Editor;
  transaction?: Transaction;
  setMessage: ICUEditorStore['actions']['setMessage'];
  setVariables: ICUEditorStore['actions']['setVariables'];
  parser: typeof minimalParser | Remote<typeof minimalParser>;
  setParsedMessage: ICUEditorStore['actions']['setParsedMessage'];
  clearMessageState: ICUEditorStore['actions']['clearMessageState'];
  setValidationError: ICUEditorStore['actions']['setValidationError'];
};

export const updateIcuEditor = async (params: Params) => {
  const message = params.editor.getText();
  const prevCursorPosition = params.editor.state.selection.$anchor.pos;

  params.setMessage(message);

  if (message.endsWith('{')) {
    extendInsertContent(params.editor)('}');
    return params.editor.commands.setTextSelection(prevCursorPosition);
  }

  if (message === '\n' || isUndoRedoTransaction(params.transaction)) {
    return;
  }

  const [error, parsedMessage] = await params.parser(message);

  if (!parsedMessage) {
    params.clearMessageState();
    return params.setValidationError(error);
  }

  const html = createHtml({
    parsedMessage,
    rawMessage: message,
    opts: { withFormatting: true },
  });
  params.setValidationError(undefined);
  params.setParsedMessage(parsedMessage);
  params.setVariables(parsedMessage);
  if (html.children.length) {
    extendSetContent(params.editor)(html.outerHTML);
    params.editor.commands.focus(prevCursorPosition);
  }
};
