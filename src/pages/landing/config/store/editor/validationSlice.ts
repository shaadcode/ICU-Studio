import type { ICUEditorStore } from '.';
import type { ParserError } from '@/shared/lib/icu/types';
import type { ZustandSlice } from '@/shared/config/zustand/types';

export type ICUValidationSlice = {
  actions: ICUValidationSliceActions;
  parserError: undefined | ParserError;
};

type ICUValidationSliceActions = {
  setValidationError: (err: ICUValidationSlice['parserError']) => void;
};

export const createValidationSlice: ZustandSlice<
  ICUEditorStore,
  ICUValidationSlice
> = set => ({
  parserError: undefined,
  actions: {
    setValidationError: (err) => {
      return set({ parserError: err });
    },
  },
});
