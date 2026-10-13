import { create } from 'zustand';
import { attemptAsync } from 'es-toolkit';
import type { Store } from '@tauri-apps/plugin-store';
import { notifications } from '@mantine/notifications';
import { remove, BaseDirectory } from '@tauri-apps/plugin-fs';

import { storeKeys } from '@/shared/config/tauri';
import { checkFileExist } from '@/shared/lib/tauri';
import { createSelectors } from '@/shared/config/zustand/createSelector';
import type { ProjectSchema } from '@/pages/landing/ui/I18nManager/Navbar/CreateNewProject/types';

export type I18nManagerStore = {
  isDirty: boolean;
  projects: Array<ProjectSchema>;
  actions: I18nManagerStoreActions;
  initialContent: string | undefined;
  i18nManagerLocalStore: Store | undefined;
  selectedProject: undefined | ProjectSchema;
};

type I18nManagerStoreActions = {
  setI18nManagerStore: (value: Store) => void;
  addProject: (project: ProjectSchema) => Promise<void>;
  deleteProject: (project: ProjectSchema) => Promise<void>;
  setProjects: (projects: I18nManagerStore['projects']) => void;
  setSelectedProject: (value: undefined | ProjectSchema) => void;
};

const i18nManagerStoreBase = create<I18nManagerStore>()((set, get) => ({
  projects: [],
  isDirty: false,
  initialContent: undefined,
  selectedProject: undefined,
  i18nManagerLocalStore: undefined,
  actions: {
    setProjects: projects => set({ projects }),
    setSelectedProject: value => set({ selectedProject: value }),
    setI18nManagerStore: store => set({ i18nManagerLocalStore: store }),
    deleteProject: async (project) => {
      const store = get().i18nManagerLocalStore;
      const selectedProject = get().selectedProject;

      if (!store) {
        return;
      }

      await attemptAsync(async () => {
        const existingProjects
          = (await store.get<ProjectSchema[]>(storeKeys.i18nManager.projects)) ?? [];

        const updatedProjects = existingProjects.filter(
          p => p.baseDirectoryPath !== project.baseDirectoryPath,
        );

        await store.set(storeKeys.i18nManager.projects, updatedProjects);
        await store.save();

        const isFileExist = await checkFileExist(project.baseDirectoryPath);
        if (isFileExist) {
          await remove(project.baseDirectoryPath, { baseDir: BaseDirectory.AppData });
        }

        if (project.baseDirectoryPath === selectedProject?.baseDirectoryPath) {
          set({ selectedProject: undefined });
        }
      });
    },

    addProject: async (project) => {
      const store = get().i18nManagerLocalStore;

      if (!store) {
        notifications.show({
          color: 'red',
          title: 'Store not initialized',
          message: 'i18nManagerLocalStore is undefined',
        });
        return;
      }

      const existingProjects
        = (await store.get<ProjectSchema[]>(storeKeys.i18nManager.projects)) ?? [];

      const isDuplicate = existingProjects.some(
        p => p.baseDirectoryPath === project.baseDirectoryPath,
      );

      if (isDuplicate) {
        notifications.show({
          color: 'orange',
          title: 'Duplicate project',
          message: `Project with path "${project.baseDirectoryPath}" already exists.`,
        });
        return;
      }

      await attemptAsync(async () => {
        const updatedProjects = [...existingProjects, project];
        await store.set(storeKeys.i18nManager.projects, updatedProjects);
        await store.save();

        set({ selectedProject: project, projects: updatedProjects });
      });
    },
  },
}));

export const i18nManagerStore = createSelectors(i18nManagerStoreBase);
