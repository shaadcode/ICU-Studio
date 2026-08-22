import { create } from 'zustand';

import type { ICUTemplatesSearchSlice } from './searchSlice';
import { createICUTemplatesSearchSlice } from './searchSlice';
import { createSelectors } from '@/shared/config/zustand/createSelector';

export type ICUEditorStore = ICUTemplatesSearchSlice;

const icuEditorStoreBase = create<ICUEditorStore>()((set, get, store) => {
  const templateSearchSlice = createICUTemplatesSearchSlice(...[set, get, store]);
  return {
    ...templateSearchSlice,
    actions: {
      ...templateSearchSlice.actions,
    },
  };
});

export const icuEditorStore = createSelectors(icuEditorStoreBase);
