import { create } from 'zustand';
import { attemptAsync } from 'es-toolkit';
import type { Store } from '@tauri-apps/plugin-store';
import { notifications } from '@mantine/notifications';

import type { Project } from './types';
import { storeKeys } from '@/shared/config/tauri';
import type { Translator } from '@/shared/config/reactI18n/types';
import { createSelectors } from '@/shared/config/zustand/createSelector';
import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';
import type { ProjectAnalysisResult } from '@/pages/landing/model/patterns/types';
import type { BaseProjectInfo } from '@/pages/landing/ui/I18nManager/Navbar/CreateNewProject/types';
import type { I18nManagerTabKey } from '@/pages/landing/ui/I18nManager/Main/useHandleI18nManagerMain';

export type I18nManagerStore = {
  isDirty: boolean;
  activeTab: I18nManagerTabKey;
  projects: Array<BaseProjectInfo>;
  actions: I18nManagerStoreActions;
  initialContent: string | undefined;
  selectedProjectData: Project | undefined;
  i18nManagerLocalStore: Store | undefined;
  selectedProject: undefined | BaseProjectInfo;
  selectedProjectAnalysis: undefined | ProjectAnalysisResult;
};

type I18nManagerStoreActions = {
  setI18nManagerStore: (value: Store) => void;
  setProjectAnalysis: (v: ProjectAnalysisResult) => void;
  setActiveTab: (v: I18nManagerStore['activeTab']) => void;
  setSelectedProjectData: (value: Project | undefined) => void;
  setProjects: (projects: I18nManagerStore['projects']) => void;
  setSelectedProject: (value: undefined | BaseProjectInfo) => void;
  addProject: (params: {
    project: BaseProjectInfo;
    tCommon: Translator<'common'>;
    tI18nManager: Translator<'i18nManager'>;
  }) => Promise<void>;
  deleteProject: (project: {
    project: BaseProjectInfo;
    tCommon: Translator<'common'>;
    tI18nManager: Translator<'i18nManager'>;
  }) => Promise<void>;
  updateSelectedProject: (params: {
    tCommon: Translator<'common'>;
    updatedProject: BaseProjectInfo;
    tI18nManager: Translator<'i18nManager'>;
  }) => Promise<void>;
};

const i18nManagerStoreBase = create<I18nManagerStore>()((set, get) => ({
  projects: [],
  isDirty: false,
  activeTab: 'structure',
  initialContent: undefined,
  selectedProject: undefined,
  selectedProjectData: undefined,
  i18nManagerLocalStore: undefined,
  selectedProjectAnalysis: undefined,
  actions: {
    setProjects: projects => set({ projects }),
    setActiveTab: tab => set({ activeTab: tab }),
    setProjectAnalysis: v => set({ selectedProjectAnalysis: v }),
    setSelectedProject: value => set({ selectedProject: value }),
    setSelectedProjectData: data => set({ selectedProjectData: data }),
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
          = (await store.get<BaseProjectInfo[]>(storeKeys.i18nManager.projects)) ?? [];

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
        = (await store.get<Array<BaseProjectInfo>>(storeKeys.i18nManager.projects)) ?? [];

      const isDuplicate = existingProjects.some(
        p => p.baseDirectoryPath === params.project.baseDirectoryPath,
      );

      if (isDuplicate) {
        notifications.show({
          color: 'orange',
          title: params.tI18nManager('errors.duplicateProject.title'),
          message: params.tI18nManager(
            'errors.duplicateProject.message',
            { path: params.project.baseDirectoryPath } as any,
          ),
        });
        return;
      }
      const patternAction = i18nManagerPatternsActions[params.project.structureType];
      const projectData = await patternAction.getProjectData({
        project: params.project,
        onWatch: patternAction.handleWatch,
        setProjectAnalysis: get().actions.setProjectAnalysis,
      });

      const newProject = {
        ...params.project,
        ...projectData,
      };

      await attemptAsync(async () => {
        const updatedProjects = [...existingProjects, newProject];
        await store.set(storeKeys.i18nManager.projects, updatedProjects);
        await store.save();

        set({
          projects: updatedProjects,
          selectedProject: newProject,
        });
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
        = (await store.get<Array<BaseProjectInfo>>(storeKeys.i18nManager.projects)) ?? [];

      const targetIndex = existingProjects.findIndex(
        p => p.baseDirectoryPath === params.updatedProject.baseDirectoryPath,
      );

      if (targetIndex === -1) {
        notifications.show({
          color: 'orange',
          title: params.tI18nManager('errors.projectNotFound.title'),
          message: params.tI18nManager(
            'errors.projectNotFound.message',
            { path: params.updatedProject.baseDirectoryPath } as any,
          ),
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
        const patternAction = i18nManagerPatternsActions[params.updatedProject.structureType];
        const projectData = await patternAction.getProjectData({
          project: params.updatedProject,
          onWatch: patternAction.handleWatch,
          setProjectAnalysis: get().actions.setProjectAnalysis,
        });

        set({
          projects: updatedProjects,
          ...(shouldUpdateSelected && {
            selectedProject: {
              ...params.updatedProject,
              ...projectData,
            },
          }),
        });
      });
    },
  },
}));

export const i18nManagerStore = createSelectors(i18nManagerStoreBase);
