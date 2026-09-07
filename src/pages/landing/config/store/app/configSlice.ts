import { attemptAsync } from 'es-toolkit';
import { extname } from '@tauri-apps/api/path';
import type { DirEntry } from '@tauri-apps/plugin-fs';
import type { Store } from '@tauri-apps/plugin-store';

import type { AppStore } from '.';
import type { ZustandSlice } from '@/shared/config/zustand/types';
import type { ViewTabsItems } from '@/pages/landing/ui/Projects/Header/Header';
import type { CreateNewProjectFormValues } from '@/pages/landing/ui/Projects/Navbar/Header/CreateProject/CreateProject';

export type AppConfigSlice = {
  locales: Array<DirEntry>;
  // selectedNamespace: DirEntry;
  actions: AppConfigSliceActions;
  view: undefined | ViewTabsItems;
  projectsStore: Store | undefined;
  selectedLocale: DirEntry | undefined;
  selectedLocaleNamespaces: Array<DirEntry>;
  projects: Array<[string, CreateNewProjectFormValues]>;
  selectedProject: undefined | CreateNewProjectFormValues;
};

type AppConfigSliceActions = {
  setProjectsStore: (value: Store) => void;
  setSelectedLocale: (locale: DirEntry) => void;
  setLocales: (locale: AppConfigSlice['locales']) => void;
  setView: (value: null | AppConfigSlice['view']) => void;
  setProjects: (projectEntries: AppConfigSlice['projects']) => void;
  deleteProject: (project: CreateNewProjectFormValues) => Promise<void>;
  setSelectedProject: (value: AppConfigSlice['selectedProject']) => void;
  setSelectedLocaleNamespaces: (namespaces: AppConfigSlice['selectedLocaleNamespaces']) => void;
};

export const createAppConfigSlice: ZustandSlice<
  AppStore,
  AppConfigSlice
> = (set, get) => ({
  locales: [],
  projects: [],
  view: 'editor',
  projectsStore: undefined,
  selectedLocale: undefined,
  selectedProject: undefined,
  selectedLocaleNamespaces: [],
  // selectedNamespace: undefined,
  actions: {
    setLocales: locales => set({ locales }),
    setProjects: projects => set({ projects }),
    setView: value => set({ view: value ?? undefined }),
    setSelectedLocale: locale => set({ selectedLocale: locale }),
    setSelectedProject: value => set({ selectedProject: value }),
    setProjectsStore: async (store) => {
      const projects = await store.entries<CreateNewProjectFormValues>();
      set({ projects, projectsStore: store });
    },
    setSelectedLocaleNamespaces: (namespaces) => {
      return set({
        selectedLocaleNamespaces: namespaces
          .filter(async namespace => await extname(namespace.name) === '.json'),
      });
    },
    deleteProject: async (targetProject) => {
      const store = get().projectsStore;
      const projects = get().projects;
      await attemptAsync(async () => {
        await store?.delete(targetProject.dirPath);
        await store?.save();
      });

      return set({
        projects: projects
          .filter(([_, value]) => value.dirPath !== targetProject.dirPath),
      });
    },
  },
});
