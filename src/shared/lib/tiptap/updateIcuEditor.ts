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
  validationError: ICUEditorStore['validationError'];
  setMessage: ICUEditorStore['actions']['setMessage'];
  setVariables: ICUEditorStore['actions']['setVariables'];
  parser: typeof minimalParser | Remote<typeof minimalParser>;
  setParsedMessage: ICUEditorStore['actions']['setParsedMessage'];
  clearMessageState: ICUEditorStore['actions']['clearMessageState'];
  setValidationError: ICUEditorStore['actions']['setValidationError'];
  clearValidationError: ICUEditorStore['actions']['clearValidationError'];
};

export const updateIcuEditor = async (params: Params) => {
  const { editor } = params;
  const message = params.editor.getText();
  const prevCursorPosition = params.editor.state.selection.$anchor.pos;
  params.setMessage(message);

  if (message.endsWith('{')) {
    extendInsertContent(params.editor)('}');
    params.editor.chain().setTextSelection(prevCursorPosition).run();
    return;
  }

  const [error, parsedMessage] = await params.parser(message.trim());

  if (!parsedMessage) {
    params.clearMessageState();
    return params.setValidationError({ error, editor });
  }

  if (
    !params.validationError && (message === '\n' || isUndoRedoTransaction(params.transaction))
  ) {
    return;
  }

  const html = createHtml({
    parsedMessage,
    rawMessage: message,
    opts: { withFormatting: true },
  });
  params.clearValidationError();
  params.setParsedMessage(parsedMessage);
  params.setVariables(parsedMessage);
  if (html.children.length) {
    extendSetContent({ editor })(html.outerHTML);

    setTimeout(() => {
      editor.chain().setTextSelection(prevCursorPosition).run();
    }, 0);
  }
};
