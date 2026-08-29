import { create } from 'zustand';

import { createValidationSlice } from './validationSlice';
import type { ICUEditorMessageSlice } from './messageSlice';
import type { ICUValidationSlice } from './validationSlice';
import type { ICUTemplatesSearchSlice } from './searchSlice';
import { createIcuEditorMessageSlice } from './messageSlice';
import { createICUTemplatesSearchSlice } from './searchSlice';
import { createSelectors } from '@/shared/config/zustand/createSelector';

export type ICUEditorStore = ICUTemplatesSearchSlice & ICUValidationSlice & ICUEditorMessageSlice;

const icuEditorStoreBase = create<ICUEditorStore>()((...rest) => {
  const templateSearchSlice = createICUTemplatesSearchSlice(...rest);
  const validationSlice = createValidationSlice(...rest);
  const messageSlice = createIcuEditorMessageSlice(...rest);

  return {
    ...templateSearchSlice,
    ...validationSlice,
    ...messageSlice,
    actions: {
      ...templateSearchSlice.actions,
      ...validationSlice.actions,
      ...messageSlice.actions,
    },
  };
});

export const icuEditorStore = createSelectors(icuEditorStoreBase);
