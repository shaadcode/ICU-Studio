import { create } from 'zustand';
import { attemptAsync } from 'es-toolkit';
import { exists } from '@tauri-apps/plugin-fs';
import type { Store } from '@tauri-apps/plugin-store';
import type { UnwatchFn } from '@tauri-apps/plugin-fs';
import { notifications } from '@mantine/notifications';

import type { Project } from './types';
import { storeKeys } from '@/shared/config/tauri';
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
  loadingProject: boolean;
  updatingProject: boolean;
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
  analyzeProject: () => Promise<void>;
  setLoadingProject: (v: boolean) => void;
  setIsAnalyzing: (value: boolean) => void;
  clearStopWatchingFns: () => Promise<void>;
  setI18nManagerStore: (value: Store) => void;
  setProjectAnalysis: (v: ProjectAnalysisResult) => void;
  setActiveTab: (v: I18nManagerStore['activeTab']) => void;
  setSelectedProjectData: (value: Project | undefined) => void;
  setProjects: (projects: I18nManagerStore['projects']) => void;
  setSelectedProject: (value: undefined | BaseProjectInfo) => void;
  setStopWatchingLocalesAndNamespacesFns: (callback: (prev: Array<UnwatchFn>) => Array<UnwatchFn>) => void;
  loadSelectedProject: (params: {
    tCommon: CommonTranslator;
    tI18nManager: I18nManagerTranslator;
  }) => Promise<void>;
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
  updateSelectedProject: (params: {
    tCommon: CommonTranslator;
    updatedProject: BaseProjectInfo;
    tI18nManager: I18nManagerTranslator;
  }) => Promise<void>;
  renameProject: (params: {
    newName: string;
    project: BaseProjectInfo;
    tCommon: CommonTranslator;
    tI18nManager: I18nManagerTranslator;
  }) => Promise<void>;
};

const i18nManagerStoreBase = create<I18nManagerStore>()((set, get) => ({
  projects: [],
  isDirty: false,
  isAnalyzing: false,
  stopWatchingFns: [],
  loadingProject: false,
  updatingProject: false,
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
    setLoadingProject: b => set({ loadingProject: b }),
    setIsAnalyzing: value => set({ isAnalyzing: value }),
    setProjectAnalysis: v => set({ selectedProjectAnalysis: v }),
    setSelectedProject: value => set({ selectedProject: value }),
    setSelectedProjectData: data => set({ selectedProjectData: data }),
    setI18nManagerStore: store => set({ i18nManagerLocalStore: store }),
    setStopWatchingLocalesAndNamespacesFns: cb => set(state => ({
      stopWatchingLocalesAndNamespacesFns: cb(state.stopWatchingLocalesAndNamespacesFns),
    })),
    clearStopWatchingFns: async () => {
      const currentStopWatching = get().stopWatchingLocalesAndNamespacesFns;

      if (currentStopWatching.length > 0) {
        await Promise.all(currentStopWatching.map(unwatch => unwatch()));
        set({ stopWatchingLocalesAndNamespacesFns: [] });
      }
    },
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
          p => p.path !== params.project.path,
        );

        await store.set(storeKeys.i18nManager.projects, updatedProjects);
        await store.save();

        set({ projects: updatedProjects, selectedProject: undefined });
      });
    },
    analyzeProject: async () => {
      const { actions, selectedProject, selectedProjectData } = get();

      if (!selectedProjectData || !selectedProject) {
        console.error('project not found in analyze Project');
        return;
      }
      const baseLocale = selectedProject.baseLocale;
      if (!baseLocale) {
        console.error('base locale is undefined');
        return;
      }

      await attemptAsync(async () => {
        actions.setIsAnalyzing(true);
        const patternActions = i18nManagerPatternsActions[selectedProjectData.structureType];

        readAndFlattenJsonFile.cache.clear();
        const result = await patternActions.analyzeProject({
          baseLocale,
          locales: selectedProjectData.locales,
          namespaces: selectedProjectData.namespaces,
        });
        actions.setProjectAnalysis(result);
        actions.setIsAnalyzing(false);
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
        p => p.path === params.project.path,
      );

      if (isDuplicate) {
        notifications.show({
          color: 'orange',
          title: params.tI18nManager('errors.duplicateProject.title'),
          message: params.tI18nManager(
            'errors.duplicateProject.message',
            { path: params.project.path } as any,
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
      const { tCommon, tI18nManager } = params;
      const { actions, selectedProject } = get();

      if (!selectedProject) {
        console.error('project not found in load selected Project');
        return;
      }
      actions.setLoadingProject(true);

      const isExistProject = await exists(selectedProject.path);
      if (!isExistProject) {
        notifications.show({
          color: 'red',
          title: tI18nManager('errors.projectNotFound.title'),
          message: tI18nManager(
            'errors.projectNotFound.message',
            { path: selectedProject.path },
          ),
        });
        actions.setSelectedProjectData(undefined);
        actions.setSelectedProject(undefined);
        return;
      }

      const [error] = await attemptAsync(async () => {
        const patternActions = i18nManagerPatternsActions[selectedProject.structureType];
        const { stopWatching, data: projectData } = await patternActions.getProjectData({
          project: selectedProject,
          onWatch: patternActions.handleWatch,
          setProjectAnalysis: actions.setProjectAnalysis,
        });
        set({
          selectedProjectData: projectData,
          stopWatchingLocalesAndNamespacesFns: stopWatching,
        });

        readAndFlattenJsonFile.cache.clear();
      });

      if (error) {
        console.error('Failed to load project:', error);
        notifications.show({
          color: 'red',
          title: tCommon('errors.unexpectedError.title'),
          message: tCommon('errors.unexpectedError.message'),
        });
      }
      actions.setLoadingProject(false);
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
      set({ updatingProject: true });
      const existingProjects
        = (await store.get<Array<BaseProjectInfo>>(storeKeys.i18nManager.projects)) ?? [];

      const targetIndex = existingProjects.findIndex(
        p => p.path === params.updatedProject.path,
      );

      if (targetIndex === -1) {
        notifications.show({
          color: 'orange',
          title: params.tI18nManager('errors.projectNotFound.title'),
          message: params.tI18nManager(
            'errors.projectNotFound.message',
            { path: params.updatedProject.path } as any,
          ),
        });
        set({ updatingProject: false });

        return;
      }

      await attemptAsync(async () => {
        const updatedProjects = [...existingProjects];
        updatedProjects[targetIndex] = params.updatedProject;

        await store.set(storeKeys.i18nManager.projects, updatedProjects);
        await store.save();

        const currentSelected = get().selectedProject;
        const shouldUpdateSelected
          = currentSelected?.path === params.updatedProject.path;
        const patternAction = i18nManagerPatternsActions[params.updatedProject.structureType];
        const projectData = await patternAction.getProjectData({
          project: params.updatedProject,
          onWatch: patternAction.handleWatch,
          setProjectAnalysis: get().actions.setProjectAnalysis,
        });

        set({
          updatingProject: false,
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
    renameProject: async (params) => {
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
        p => p.path === params.project.path,
      );

      if (targetIndex === -1) {
        notifications.show({
          color: 'orange',
          title: params.tI18nManager('errors.projectNotFound.title'),
          message: params.tI18nManager(
            'errors.projectNotFound.message',
            { path: params.project.path } as any,
          ),
        });
        return;
      }

      const isDuplicateName = existingProjects.some(
        p => p.path !== params.project.path && p.name.trim().toLowerCase() === params.newName.trim().toLowerCase(),
      );

      if (isDuplicateName) {
        notifications.show({
          color: 'orange',
          title: params.tI18nManager('errors.duplicateProjectName.title'),
          message: params.tI18nManager(
            'errors.duplicateProjectName.message',
            {
              name: params.newName,
            } as any,
          ),
        });
        return;
      }

      await attemptAsync(async () => {
        const updatedProjects = [...existingProjects];
        updatedProjects[targetIndex] = {
          ...updatedProjects[targetIndex]!,
          name: params.newName.trim(),
        };

        await store.set(storeKeys.i18nManager.projects, updatedProjects);
        await store.save();

        const currentSelected = get().selectedProject;
        const shouldUpdateSelected = currentSelected?.path === params.project.path;

        set({
          projects: updatedProjects,
          ...(shouldUpdateSelected && {
            selectedProject: {
              ...currentSelected,
              name: params.newName.trim(),
            },
          }),
        });
      });
    },
  },
}));

export const i18nManagerStore = createSelectors(i18nManagerStoreBase);
