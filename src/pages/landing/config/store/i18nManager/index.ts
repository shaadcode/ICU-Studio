import { create } from 'zustand';
import { attemptAsync } from 'es-toolkit';
import type { Store } from '@tauri-apps/plugin-store';
import { notifications } from '@mantine/notifications';

import { storeKeys } from '@/shared/config/tauri';
import type { Translator } from '@/shared/config/reactI18n/types';
import { createSelectors } from '@/shared/config/zustand/createSelector';
import type { I18nProjectTree } from '@/shared/lib/mantine/getI18nProjectData';
import type { ProjectSchema } from '@/pages/landing/ui/I18nManager/Navbar/CreateNewProject/types';

export type I18nManagerStore = {
  isDirty: boolean;
  projects: Array<ProjectSchema>;
  actions: I18nManagerStoreActions;
  initialContent: string | undefined;
  i18nManagerLocalStore: Store | undefined;
  selectedProject: undefined | ProjectSchema;
  selectedProjectData: undefined | {
    /**
     * project full path
     */
    path: string;
    recentScan: Date;
    baseLocale: string;
    filesAmount: number;
    locales: Array<string>;
    namespaces: Array<string>;
    tree: Array<I18nProjectTree>;
    structureType: ProjectSchema['structureType'];
    messages: {
      missing: number;
      translated: number;
    };
  };
};

type I18nManagerStoreActions = {
  setI18nManagerStore: (value: Store) => void;
  setProjects: (projects: I18nManagerStore['projects']) => void;
  setSelectedProject: (value: undefined | ProjectSchema) => void;
  setSelectedProjectData: (v: I18nManagerStore['selectedProjectData']) => void;
  addProject: (params: {
    project: ProjectSchema;
    tCommon: Translator<'common'>;
    tI18nManager: Translator<'i18nManager'>;
  }) => Promise<void>;
  deleteProject: (project: {
    project: ProjectSchema;
    tCommon: Translator<'common'>;
    tI18nManager: Translator<'i18nManager'>;
  }) => Promise<void>;
  updateSelectedProject: (params: {
    updatedProject: ProjectSchema;
    tCommon: Translator<'common'>;
    tI18nManager: Translator<'i18nManager'>;
  }) => Promise<void>;
};

const i18nManagerStoreBase = create<I18nManagerStore>()((set, get) => ({
  projects: [],
  isDirty: false,
  initialContent: undefined,
  selectedProject: undefined,
  selectedProjectData: undefined,
  i18nManagerLocalStore: undefined,
  actions: {

    setProjects: projects => set({ projects }),
    setSelectedProjectData: v => set({ selectedProjectData: v }),
    setSelectedProject: value => set({ selectedProject: value }),
    setI18nManagerStore: store => set({ i18nManagerLocalStore: store }),
    deleteProject: async (params) => {
      const store = get().i18nManagerLocalStore;
      if (!store) {
        notifications.show({
          color: 'red',
          title: params.tCommon('errors.storeNotInitialized.title'),
          message: params.tCommon('errors.storeNotInitialized.message'),
        });
        return;
      }

      await attemptAsync(async () => {
        const existingProjects
          = (await store.get<ProjectSchema[]>(storeKeys.i18nManager.projects)) ?? [];

        const updatedProjects = existingProjects.filter(
          p => p.baseDirectoryPath !== params.project.baseDirectoryPath,
        );

        await store.set(storeKeys.i18nManager.projects, updatedProjects);
        await store.save();

        set({ projects: updatedProjects, selectedProject: undefined });
      });
    },
    addProject: async (params) => {
      const store = get().i18nManagerLocalStore;

      if (!store) {
        notifications.show({
          color: 'red',
          title: params.tCommon('errors.storeNotInitialized.title'),
          message: params.tCommon('errors.storeNotInitialized.message'),
        });
        return;
      }

      const existingProjects
        = (await store.get<ProjectSchema[]>(storeKeys.i18nManager.projects)) ?? [];

      const isDuplicate = existingProjects.some(
        p => p.baseDirectoryPath === params.project.baseDirectoryPath,
      );

      if (isDuplicate) {
        notifications.show({
          color: 'orange',
          title: params.tI18nManager('errors.duplicateProject.title'),
          message: params.tI18nManager(
            'errors.duplicateProject.message',
            { path: params.project.baseDirectoryPath },
          ),
        });
        return;
      }

      await attemptAsync(async () => {
        const updatedProjects = [...existingProjects, params.project];
        await store.set(storeKeys.i18nManager.projects, updatedProjects);
        await store.save();

        set({ projects: updatedProjects, selectedProject: params.project });
      });
    },
    updateSelectedProject: async (params) => {
      const store = get().i18nManagerLocalStore;
      if (!store) {
        notifications.show({
          color: 'red',
          title: params.tCommon('errors.storeNotInitialized.title'),
          message: params.tCommon('errors.storeNotInitialized.message'),
        });
        return;
      }

      const existingProjects
        = (await store.get<ProjectSchema[]>(storeKeys.i18nManager.projects)) ?? [];

      const targetIndex = existingProjects.findIndex(
        p => p.baseDirectoryPath === params.updatedProject.baseDirectoryPath,
      );

      if (targetIndex === -1) {
        notifications.show({
          color: 'orange',
          title: params.tI18nManager('errors.projectNotFound.title'),
          message: params.tI18nManager('errors.projectNotFound.message', {
            path: params.updatedProject.baseDirectoryPath,
          }),
        });
        return;
      }

      await attemptAsync(async () => {
        const updatedProjects = [...existingProjects];
        updatedProjects[targetIndex] = params.updatedProject;

        await store.set(storeKeys.i18nManager.projects, updatedProjects);
        await store.save();

        const currentSelected = get().selectedProject;
        const shouldUpdateSelected
          = currentSelected?.baseDirectoryPath === params.updatedProject.baseDirectoryPath;

        set({
          projects: updatedProjects,
          ...(shouldUpdateSelected && { selectedProject: params.updatedProject }),
        });
      });
    },
  },
}));

export const i18nManagerStore = createSelectors(i18nManagerStoreBase);
