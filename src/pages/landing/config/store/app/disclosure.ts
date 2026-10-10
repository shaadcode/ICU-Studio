import type { AppStore } from '.';
import type { ZustandSlice } from '@/shared/config/zustand/types';

export type DisclosureSlice = {
  navbar: boolean;
  sidebar: boolean;
  actions: DisclosureSliceActions;
};

type OpenedBar = 'navbar' | 'sidebar';

type DisclosureSliceActions = {
  open: (bar: OpenedBar) => void;
  close: (bar: OpenedBar) => void;
  toggle: (bar: OpenedBar) => void;
};

export const createDisclosureSlice: ZustandSlice<
  AppStore,
  DisclosureSlice
> = set => ({
  navbar: false,
  sidebar: false,
  actions: {
    open: bar => set({ [bar]: true }),
    close: bar => set({ [bar]: false }),
    toggle: bar => set(state => ({ [bar]: !state[bar] })),
  },
});
