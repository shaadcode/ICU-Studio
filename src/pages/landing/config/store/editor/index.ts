import { create } from 'zustand';

import { createValidationSlice } from '../editor/validationSlice';
import type { ICUEditorMessageSlice } from '../editor/messageSlice';
import type { ICUValidationSlice } from '../editor/validationSlice';
import type { ICUTemplatesSearchSlice } from '../editor/searchSlice';
import { createIcuEditorMessageSlice } from '../editor/messageSlice';
import { createICUTemplatesSearchSlice } from '../editor/searchSlice';
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
