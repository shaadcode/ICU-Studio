import { create } from 'zustand';

import type { DisclosureSlice } from './disclosure';
import type { AppConfigSlice } from './configSlice';
import { createAppConfigSlice } from './configSlice';
import { createDisclosureSlice } from './disclosure';
import { createSelectors } from '@/shared/config/zustand/createSelector';

export type AppStore = AppConfigSlice & DisclosureSlice;

const appStoreBase = create<AppStore>()((...rest) => {
  const appConfigSlice = createAppConfigSlice(...rest);
  const disclosureSlice = createDisclosureSlice(...rest);
  return {
    ...appConfigSlice,
    ...disclosureSlice,
    actions: {
      ...appConfigSlice.actions,
      ...disclosureSlice.actions,
    },
  };
});

export const appStore = createSelectors(appStoreBase);
