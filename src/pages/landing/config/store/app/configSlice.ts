import type { AppStore } from '.';
import type { ZustandSlice } from '@/shared/config/zustand/types';

export type ViewTabsItems = 'editor' | 'messages' | 'i18nManager';
export type AppConfigSlice = {
  actions: AppConfigSliceActions;
  view: undefined | ViewTabsItems;
};

type AppConfigSliceActions = {
  setView: (value: null | AppConfigSlice['view']) => void;
};

export const createAppConfigSlice: ZustandSlice<
  AppStore,
  AppConfigSlice
> = set => ({
  view: 'editor',
  actions: {
    setView: value => set({ view: value ?? undefined }),
  },
});
