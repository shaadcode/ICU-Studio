import type { Editor } from '@tiptap/react';

import { extendSetContent } from './extendSetContent';
import type { ICUEditorStore } from '@/pages/landing/config/store';
import { createHtml, minimalParser, collectVariables } from '../icu';

type Params = {
  editor: Editor;
  setMessage: ICUEditorStore['actions']['setMessage'];
  setVariables: ICUEditorStore['actions']['setVariables'];
  setParsedMessage: ICUEditorStore['actions']['setParsedMessage'];
  setValidationError: ICUEditorStore['actions']['setValidationError'];
};
export const updateIcuEditor = (params: Params) => {
  const message = params.editor.getText();
  const prevCursorPosition = params.editor.state.selection.$anchor.pos;
  params.setMessage(message);
  const [error, parsedMessage] = minimalParser(message);
  if (!parsedMessage) {
    return params.setValidationError(error);
  }

  const html = createHtml(parsedMessage, { withFormatting: true });
  params.setValidationError(undefined);
  if (html.children.length) {
    const variables = collectVariables(parsedMessage);
    extendSetContent(params.editor)(html.outerHTML);
    params.setParsedMessage(parsedMessage);
    params.setVariables(variables);
    params.editor.commands.setTextSelection(prevCursorPosition);
  }
};
