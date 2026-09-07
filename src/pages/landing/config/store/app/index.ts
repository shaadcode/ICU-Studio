import { create } from 'zustand';

import type { AppConfigSlice } from './configSlice';
import { createAppConfigSlice } from './configSlice';
import { createSelectors } from '@/shared/config/zustand/createSelector';

export type AppStore = AppConfigSlice;

const appStoreBase = create<AppStore>()((...rest) => {
  const appConfigSlice = createAppConfigSlice(...rest);
  return {
    ...appConfigSlice,
    actions: {
      ...appConfigSlice.actions,
    },
  };
});

export const appStore = createSelectors(appStoreBase);
