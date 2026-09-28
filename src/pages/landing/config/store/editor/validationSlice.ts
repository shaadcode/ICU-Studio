import type { ICUEditorStore } from '.';
import type { ParserError } from '@/shared/lib/icu/types';
import type { ZustandSlice } from '@/shared/config/zustand/types';

export type ICUValidationSlice = {
  actions: ICUValidationSliceActions;
  validationError: undefined | ParserError;
};

type ICUValidationSliceActions = {
  setValidationError: (err: ICUValidationSlice['validationError']) => void;
};

export const createValidationSlice: ZustandSlice<
  ICUEditorStore,
  ICUValidationSlice
> = set => ({
  validationError: undefined,
  actions: {
    setValidationError: (err) => {
      return set({ validationError: err });
    },
  },
});
