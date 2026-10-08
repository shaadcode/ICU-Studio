import type React from 'react';
import type { ReactNode } from 'react';
import type { Transaction } from '@tiptap/pm/state';
import type { Range, Editor, EditorOptions } from '@tiptap/react';
import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';

import type { ICUEditorStore } from '.';
import type { ZustandSlice } from '@/shared/config/zustand/types';
import type { VariableInfo } from '@/shared/lib/icu/collectVariables';
import type { ParserError, MessageElementsTypeEnum } from '@/shared/lib/icu/types';
import { createHtml, TagVariable, minimalParser, collectVariables } from '@/shared/lib/icu';
import { extendSetContent, extendInsertContent, isUndoRedoTransaction } from '@/shared/lib/tiptap';

export type ICUEditorMessageSlice = {
  isEmpty: boolean;
  textContent: string;
  isFormatted: boolean;
  editorInstance: Editor | undefined;
  actions: ICUEditorMessageSliceActions;
  parsedMessage: undefined | Array<MessageFormatElement>;
  delimitersRange: Record<
    ReferenceId,
    { type: string; open?: Range; close?: Range }
  >;
  variables: Array<VariableInfo & { value: Date | string | number | ((chunks: ReactNode) => React.JSX.Element) }>;
};
type ReferenceId = string;

type ICUEditorMessageSliceActions = {
  clearStore: () => void;
  clearMessageState: () => void;
  setIsEmpty: (value: boolean) => void;
  setFormatted: (value: boolean) => void;
  setTextContent: (value: string) => void;
  setVariables: (value: Array<MessageFormatElement>) => void;
  setParsedMessage: (value: ICUEditorMessageSlice['parsedMessage']) => void;
  setEditorInstance: (editor: ICUEditorMessageSlice['editorInstance']) => void;
  updateVariableInitialValue: (valueName: string, value: Date | string | number) => void;
  formatContent: (params?: {
    editor?: Editor;
    transaction?: Transaction;
    onRenderMessage?: () => void;
    onMountEditor?: EditorOptions['onMount'];
    onUpdateEditor?: EditorOptions['onUpdate'];
    onParserError?: (error: ParserError) => void;
  }) => void;
};

export const createIcuEditorMessageSlice: ZustandSlice<ICUEditorStore, ICUEditorMessageSlice> = (set, get) => ({
  isEmpty: true,
  variables: [],
  textContent: '',
  isFormatted: false,
  message: undefined,
  delimitersRange: {},
  parsedMessage: undefined,
  editorInstance: undefined,
  actions: {
    setIsEmpty: v => set({ isEmpty: v }),
    setFormatted: v => set({ isFormatted: v }),
    setVariables: setVariablesHandler(set, get),
    setTextContent: v => set({ textContent: v }),
    setParsedMessage: value => set({ parsedMessage: value }),
    setEditorInstance: editor => set({ editorInstance: editor }),
    clearStore: () => {
      get().actions.clearMessageState();
      set({ editorInstance: undefined });
    },
    clearMessageState: () => set({
      variables: [],
      delimitersRange: {},
      parsedMessage: undefined,
    }),
    updateVariableInitialValue: (varName, value) => {
      const variables = get().variables;
      const result = variables.map((variable) => {
        if (variable.name === varName) {
          return { ...variable, value };
        }

        return variable;
      });

      return set({ variables: result });
    },
    formatContent(params) {
      const editor = params?.editor ?? get().editorInstance;
      const actions = get().actions;
      if (!editor) {
        throw new Error('editor is undefined - formatContent in icu editor store');
      }

      const message = editor.getText();
      const prevCursorPosition = editor.state.selection.$anchor.pos;

      if (message.endsWith('{')) {
        extendInsertContent(editor)('}');
        editor.chain().setTextSelection(prevCursorPosition).run();
        return;
      }

      const [error, parsedMessage] = minimalParser(message.trim());
      if (!parsedMessage) {
        params?.onParserError?.(error);
        actions.clearMessageState();
        set({ isFormatted: false });
        return actions.setValidationError({ error, editor });
      }

      if (!get().validationError
        && params?.transaction
        && (message === '\n' || isUndoRedoTransaction(params?.transaction))) {
        return;
      }

      const html = createHtml({
        parsedMessage,
        rawMessage: message,
        opts: { withFormatting: true },
      });
      actions.clearValidationError();
      actions.setParsedMessage(parsedMessage);
      actions.setVariables(parsedMessage);
      if (html.children.length) {
        extendSetContent({ editor })(html.outerHTML);

        setTimeout(() => {
          editor.chain().setTextSelection(prevCursorPosition).run();
        }, 0);

        params?.onRenderMessage?.();

        set({ isFormatted: true });
      }
    },
  },
});

type Variable = ICUEditorMessageSlice['variables'][number];

function setVariablesHandler(
  set: Parameters<ZustandSlice<ICUEditorStore, ICUEditorMessageSlice>>[0],
  get: Parameters<ZustandSlice<ICUEditorStore, ICUEditorMessageSlice>>[1],
) {
  return (parsedMessage: Parameters<ICUEditorMessageSliceActions['setVariables']>[0]): ReturnType<ICUEditorMessageSliceActions['setVariables']> => {
    const collectedVariables = collectVariables(parsedMessage);

    if (collectedVariables.errors.length) {
      get().actions.setValidationError({
        editor: get().editorInstance!,
        error: collectedVariables.errors[0] as ParserError,
      });
      return;
    }

    const initializedVariablesValues = collectedVariables.variables
      .map((variable) => {
        const [, info] = variable;

        if (info.enumType === 0 || info.enumType === 7) {
          return {};
        }

        const addProperty = (initialValue: Variable['value']): Variable => ({
          ...info,
          value: initialValue,
        });
        const typesMap = {
          0: () => ({}),
          7: () => ({}),
          6: () => addProperty(1),
          2: () => addProperty(5),
          3: () => addProperty(new Date()),
          4: () => addProperty(new Date()),
          1: () => addProperty(`[${info.name}]`),
          5: () => addProperty(info.config?.conditions?.[0] ?? 'unknown'),
          8: () => addProperty(children => <TagVariable variable={info}>{children}</TagVariable>),
        } as const satisfies Record<MessageElementsTypeEnum, () => object>;
        return typesMap[info.enumType]();
      }) as ICUEditorMessageSlice['variables'];

    return set({ variables: initializedVariablesValues });
  };
}
