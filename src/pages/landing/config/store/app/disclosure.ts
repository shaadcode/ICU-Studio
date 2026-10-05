import type { AppStore } from '.';
import type { ZustandSlice } from '@/shared/config/zustand/types';

export type DisclosureSlice = {
  opened: boolean;
  actions: DisclosureSliceActions;
};

type DisclosureSliceActions = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const createDisclosureSlice: ZustandSlice<
  AppStore,
  DisclosureSlice
> = set => ({
  opened: false,
  actions: {
    open: () => set({ opened: true }),
    close: () => set({ opened: false }),
    toggle: () => set(state => ({ opened: !state.opened })),
  },
});
