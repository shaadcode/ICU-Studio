import type { Editor } from '@tiptap/react';

import type { ICUEditorStore } from '.';
import { getLineRange } from '@/shared/lib/icu';
import type { ParserError } from '@/shared/lib/icu/types';
import type { ZustandSlice } from '@/shared/config/zustand/types';

export type ICUValidationSlice = {
  actions: ICUValidationSliceActions;
  validationError: undefined | ParserError;
  errorLocation: undefined | {
    lineNumber?: number;
    end?: ParserError['location']['end'];
    start?: ParserError['location']['start'];
    lineRange?: ReturnType<typeof getLineRange>;
  };
};

type ICUValidationSliceActions = {
  clearValidationError: () => void;
  setValidationError: (params: { editor: Editor; error: ParserError }) => void;
};

export const createValidationSlice: ZustandSlice<
  ICUEditorStore,
  ICUValidationSlice
> = set => ({
  errorLocation: undefined,
  validationError: undefined,
  actions: {
    clearValidationError: () => set({ errorLocation: undefined, validationError: undefined }),
    setValidationError: (payload) => {
      const error = payload?.error;
      const editor = payload?.editor;
      if (error && editor) {
        switch (error.message) {
          case 'MISSING_OTHER_CLAUSE':{
            const targetLine = convertParserLineToTiptapLine(error.location.start.line);
            set({
              errorLocation: {
                ...error.location,
                lineNumber: targetLine,
                lineRange: getLineRange(
                  editor,
                  targetLine,
                ),
              },
            });
            break;
          }

          default:
            set({
              errorLocation: error.location,
            });
            break;
        }
      }

      return set({ validationError: payload.error });
    },
  },
});

function convertParserLineToTiptapLine(line: number) {
  return line - 1;
}
