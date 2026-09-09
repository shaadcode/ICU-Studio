import { create } from 'zustand';

import { createValidationSlice } from '../editor/validationSlice';
import type { ICUEditorMessageSlice } from '../editor/messageSlice';
import type { ICUValidationSlice } from '../editor/validationSlice';
import { createIcuEditorMessageSlice } from '../editor/messageSlice';
import { createSelectors } from '@/shared/config/zustand/createSelector';

export type ICUEditorStore = ICUValidationSlice & ICUEditorMessageSlice;

const icuEditorStoreBase = create<ICUEditorStore>()((...rest) => {
  const validationSlice = createValidationSlice(...rest);
  const messageSlice = createIcuEditorMessageSlice(...rest);

  return {
    ...validationSlice,
    ...messageSlice,
    actions: {
      ...validationSlice.actions,
      ...messageSlice.actions,
    },
  };
});

export const icuEditorStore = createSelectors(icuEditorStoreBase);
