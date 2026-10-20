import { create } from 'zustand';
import { attemptAsync } from 'es-toolkit';
import { exists } from '@tauri-apps/plugin-fs';
import type { Store } from '@tauri-apps/plugin-store';
import type { UnwatchFn } from '@tauri-apps/plugin-fs';
import { notifications } from '@mantine/notifications';

import type { Project } from './types';
import { storeKeys } from '@/shared/config/tauri';
// import type { Translator } from '@/shared/config/reactI18n/types';
import { createSelectors } from '@/shared/config/zustand/createSelector';
import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';
import type { ProjectAnalysisResult } from '@/pages/landing/model/patterns/types';
import type { CommonTranslator, I18nManagerTranslator } from '@/shared/config/reactI18n/types';
import type { BaseProjectInfo } from '@/pages/landing/ui/I18nManager/Navbar/CreateNewProject/types';
import type { I18nManagerTabKey } from '@/pages/landing/ui/I18nManager/Main/useHandleI18nManagerMain';
import { readAndFlattenJsonFile } from '@/pages/landing/model/patterns/locale-folder-namespace-file/analyze';

export type I18nManagerStore = {
  isDirty: boolean;
  isAnalyzing: boolean;
  activeTab: I18nManagerTabKey;
  projects: Array<BaseProjectInfo>;
  actions: I18nManagerStoreActions;
  initialContent: string | undefined;
  selectedProjectData: Project | undefined;
  i18nManagerLocalStore: Store | undefined;
  selectedProject: undefined | BaseProjectInfo;
  stopWatchingLocalesAndNamespacesFns: Array<UnwatchFn>;
  selectedProjectAnalysis: undefined | ProjectAnalysisResult;
};

type I18nManagerStoreActions = {
  setIsAnalyzing: (value: boolean) => void;
  setI18nManagerStore: (value: Store) => void;
  setProjectAnalysis: (v: ProjectAnalysisResult) => void;
  setActiveTab: (v: I18nManagerStore['activeTab']) => void;
  setSelectedProjectData: (value: Project | undefined) => void;
  setProjects: (projects: I18nManagerStore['projects']) => void;
  setSelectedProject: (value: undefined | BaseProjectInfo) => void;
  addProject: (params: {
    project: BaseProjectInfo;
    tCommon: CommonTranslator;
    tI18nManager: I18nManagerTranslator;
  }) => Promise<void>;
  deleteProject: (project: {
    project: BaseProjectInfo;
    tCommon: CommonTranslator;
    tI18nManager: I18nManagerTranslator;
  }) => Promise<void>;
  loadSelectedProject: (params: {
    project: BaseProjectInfo;
    tCommon: CommonTranslator;
    tI18nManager: I18nManagerTranslator;
  }) => Promise<void>;
  updateSelectedProject: (params: {
    tCommon: CommonTranslator;
    updatedProject: BaseProjectInfo;
    tI18nManager: I18nManagerTranslator;
  }) => Promise<void>;
};

const i18nManagerStoreBase = create<I18nManagerStore>()((set, get) => ({
  projects: [],
  isDirty: false,
  isAnalyzing: false,
  stopWatchingFns: [],
  activeTab: 'structure',
  initialContent: undefined,
  selectedProject: undefined,
  selectedProjectData: undefined,
  i18nManagerLocalStore: undefined,
  selectedProjectAnalysis: undefined,
  stopWatchingLocalesAndNamespacesFns: [],
  actions: {
    setProjects: projects => set({ projects }),
    setActiveTab: tab => set({ activeTab: tab }),
    setIsAnalyzing: value => set({ isAnalyzing: value }),
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
          p => p.projectPath !== params.project.projectPath,
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
        p => p.projectPath === params.project.projectPath,
      );

      if (isDuplicate) {
        notifications.show({
          color: 'orange',
          title: params.tI18nManager('errors.duplicateProject.title'),
          message: params.tI18nManager(
            'errors.duplicateProject.message',
            { path: params.project.projectPath } as any,
          ),
        });
        return;
      }

      await attemptAsync(async () => {
        const updatedProjects = [...existingProjects, params.project];
        await store.set(storeKeys.i18nManager.projects, updatedProjects);
        await store.save();

        set({
          projects: updatedProjects,
          selectedProject: params.project,
        });
      });
    },
    loadSelectedProject: async (params) => {
      const { project, tCommon, tI18nManager } = params;
      const { actions } = get();

      const currentStopWatching = get().stopWatchingLocalesAndNamespacesFns;
      if (currentStopWatching.length > 0) {
        await Promise.all(currentStopWatching.map(unwatch => unwatch()));
        set({ stopWatchingLocalesAndNamespacesFns: [] });
      }

      const isExistProject = await exists(project.projectPath);
      if (!isExistProject) {
        notifications.show({
          color: 'red',
          title: tI18nManager('errors.projectNotFound.title'),
          message: tI18nManager(
            'errors.projectNotFound.message',
            { path: project.projectPath },
          ),
        });
        actions.setSelectedProjectData(undefined);
        actions.setSelectedProject(undefined);
        return;
      }

      try {
        const patternActions = i18nManagerPatternsActions[project.structureType];

        set({ isAnalyzing: true });

        const { stopWatching, data: projectData } = await patternActions.getProjectData({
          project,
          onWatch: patternActions.handleWatch,
          setProjectAnalysis: actions.setProjectAnalysis,
        });

        set({
          selectedProjectData: projectData,
          stopWatchingLocalesAndNamespacesFns: stopWatching,
        });

        readAndFlattenJsonFile.cache.clear();
      } catch (error) {
        console.error('Failed to load project:', error);
        notifications.show({
          color: 'red',
          title: tCommon('errors.unexpectedError.title'),
          message: tCommon('errors.unexpectedError.message'),
        });
      } finally {
        set({ isAnalyzing: false });
      }
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
        p => p.projectPath === params.updatedProject.projectPath,
      );

      if (targetIndex === -1) {
        notifications.show({
          color: 'orange',
          title: params.tI18nManager('errors.projectNotFound.title'),
          message: params.tI18nManager(
            'errors.projectNotFound.message',
            { path: params.updatedProject.projectPath } as any,
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
          = currentSelected?.projectPath === params.updatedProject.projectPath;
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
