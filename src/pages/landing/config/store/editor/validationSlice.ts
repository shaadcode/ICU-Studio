import type { Editor } from '@tiptap/react';

import type { ICUEditorStore } from '.';
import { getLineRangeOffset } from '@/shared/lib/icu';
import type { ParserError } from '@/shared/lib/icu/types';
import type { ZustandSlice } from '@/shared/config/zustand/types';
import { getLineRangeOffsetByOneLine } from '@/shared/lib/icu/getLineRangeOffset';

export type ICUValidationSlice = {
  actions: ICUValidationSliceActions;
  validationError: undefined | ParserError;
  errorLocation: undefined | {
    end: number;
    start: number;
    lineRangeOffset: {
      end: number;
      start: number;
    };
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
    clearValidationError: () => set({
      errorLocation: undefined,
      validationError: undefined,
    }),
    setValidationError: (payload) => {
      const error = payload?.error;
      const editor = payload?.editor;
      const { location } = error;

      if (error && editor) {
        set({
          validationError: payload.error,
          errorLocation: {
            end: location.end.offset + 1,
            start: location.start.offset + 1,
            lineRangeOffset: location.end.line === location.start.line
              ? getLineRangeOffsetByOneLine(
                editor,
                error.location.start.line,
              ) ?? {
                end: location.end.offset + 1,
                start: location.start.offset + 1,
              }
              : {
                  end: getLineRangeOffset(
                    editor,
                    location.end.line,
                  ) ?? location.end.offset + 1,
                  start: getLineRangeOffset(
                    editor,
                    location.start.line,
                  ) ?? location.start.offset + 1,
                },
          },
        });
      }
    },
  },
});
