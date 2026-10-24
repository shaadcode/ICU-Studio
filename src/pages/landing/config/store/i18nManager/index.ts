import { create } from 'zustand';
import type { Store } from '@tauri-apps/plugin-store';

import type { ProjectsSlice } from './porject/projectSlice';
import { createProjectsSlice } from './porject/projectSlice';
import type { JsonEditorSlice } from './jsonEditor/jsonEditorSlice';
import { createJsonEditorSlice } from './jsonEditor/jsonEditorSlice';
import { createSelectors } from '@/shared/config/zustand/createSelector';
import type { I18nManagerTabKey } from '@/pages/landing/ui/I18nManager/Main/useHandleI18nManagerMain';

export type I18nManagerStore = JsonEditorSlice & ProjectsSlice & Core;

type Core = {
  activeTab: I18nManagerTabKey;
  i18nManagerLocalStore: Store | undefined;
  actions: {
    setI18nManagerLocalStore: (v: Store) => void;
    setActiveTab: (v: I18nManagerStore['activeTab']) => void;
  };
};

export const i18nManagerStoreBase = create<I18nManagerStore>()((...rest) => {
  const [set] = rest;
  const projectSlice = createProjectsSlice(...rest);
  const jsonEditorSlice = createJsonEditorSlice(...rest);
  return {
    ...projectSlice,
    ...jsonEditorSlice,
    activeTab: 'structure',
    i18nManagerLocalStore: undefined,
    actions: {
      ...projectSlice.actions,
      ...jsonEditorSlice.actions,
      setActiveTab: tab => set({ activeTab: tab }),
      setI18nManagerLocalStore: v => set({ i18nManagerLocalStore: v }),
    },
  };
});

export const i18nManagerStore = createSelectors(i18nManagerStoreBase);
