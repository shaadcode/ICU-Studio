import type { I18nManagerStore } from '..';
import type { Locale, Namespace } from '../types';
import type { ZustandSlice } from '@/shared/config/zustand/types';

export type JsonEditorSlice = {
  actions: JsonEditorSliceActions;
  entityData: Locale | Namespace | undefined;
};

type JsonEditorSliceActions = {
  setEntityData: (v: JsonEditorSlice['entityData']) => void;
};

export const createJsonEditorSlice: ZustandSlice<
  I18nManagerStore,
  JsonEditorSlice
> = set => ({
  entityData: undefined,
  actions: {
    setEntityData: v => set({ entityData: v }),
  },
});
