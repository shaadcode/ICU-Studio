import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';
import type { UnwatchFn } from '@tauri-apps/plugin-fs';
import { notifications } from '@mantine/notifications';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';

export type I18nManagerTabKey = 'locales' | 'analysis' | 'settings' | 'structure' | 'namespaces';

export const useHandleI18nManagerMain = () => {
  const selectedProject = i18nManagerStore.use.selectedProject();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<I18nManagerTabKey>('structure');
  const selectedProjectData = i18nManagerStore.use.selectedProjectData();
  const projects = i18nManagerStore.use.projects();
  const setSelectedProjectData = i18nManagerStore.use.actions().setSelectedProjectData;
  const setProjectAnalysis = i18nManagerStore.use.actions().setProjectAnalysis;
  const setBaseLocale = () => {};

  const handlers = {
    handleConvertCsv: () => {
      // TODO: تبدیل JSON ↔ CSV
    },

    handleOpenSettings: () => {
      // TODO: باز کردن modal تنظیمات
    },

    handleLearnMoreNaming: () => {
      // TODO: باز کردن لینک مستندات
    },

    handleAddLocale: () => {
      // TODO: باز کردن modal افزودن locale
    },

    handleOpenExplorer: () => {
      // TODO: باز کردن پوشه در explorer
    },

    handleAddNamespace: () => {
      // TODO: باز کردن modal افزودن namespace
    },

    handleAddDefaultNamespace: () => {
      // TODO: افزودن namespace پیش‌فرض
    },

    handleExportReport: () => {
      notifications.show({
        color: 'green',
        title: t('i18nManager.notifications.exportStarted.title'),
        message: t('i18nManager.notifications.exportStarted.message'),
      });
    },

    handleScan: () => {
      notifications.show({
        color: 'blue',
        title: t('i18nManager.notifications.scanStarted.title'),
        message: t('i18nManager.notifications.scanStarted.message'),
      });
      // TODO: فراخوانی سرویس اسکن
    },

    handleRescan: () => {
      notifications.show({
        color: 'blue',
        title: t('i18nManager.notifications.rescanStarted.title'),
        message: t('i18nManager.notifications.rescanStarted.message'),
      });
      // TODO: فراخوانی سرویس rescan
    },
  };

  useEffect(() => {
    let stopWatchingState: undefined | Array<UnwatchFn>;
    if (selectedProject) {
      (async () => {
        const patternActions = i18nManagerPatternsActions[selectedProject.structureType];

        const { stopWatching, data: project } = await patternActions.getProjectData({
          setProjectAnalysis,
          project: selectedProject,
          onWatch: patternActions.handleWatch,
        });

        stopWatchingState = stopWatching;
        setSelectedProjectData(project);
      })();
    }

    return () => {
      if (stopWatchingState) {
        Promise.all(stopWatchingState.map(unWatchFn => unWatchFn()));
      }
    };
  }, [selectedProject]);

  return {
    t,
    handlers,
    projects,
    activeTab,
    setActiveTab,
    setBaseLocale,
    selectedProject,
    selectedProjectData,
  };
};
