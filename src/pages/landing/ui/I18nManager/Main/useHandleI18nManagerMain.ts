import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type I18nManagerTabKey = 'locales' | 'analysis' | 'settings' | 'structure' | 'namespaces';

export const useHandleI18nManagerMain = () => {
  const selectedProject = i18nManagerStore.use.selectedProject();
  const tCommon = useTranslations('common');
  const tI18nManager = useTranslations('i18nManager');
  const [activeTab, setActiveTab] = useState<I18nManagerTabKey>('structure');
  const selectedProjectData = i18nManagerStore.use.selectedProjectData();
  const projects = i18nManagerStore.use.projects();
  const loadSelectedProject = i18nManagerStore.use.actions().loadSelectedProject;
  const clearStopWatchingFns = i18nManagerStore.use.actions().clearStopWatchingFns;
  const loadingProject = i18nManagerStore.use.loadingProject();
  const baseLocale = selectedProject?.baseLocale;
  useEffect(() => {
    if (selectedProject) {
      (async () => {
        await clearStopWatchingFns();
        await loadSelectedProject({ tCommon, tI18nManager });
      })();
    }
  }, [selectedProject?.path]);

  return {
    projects,
    activeTab,
    baseLocale,
    setActiveTab,
    tI18nManager,
    loadingProject,
    selectedProject,
    selectedProjectData,
  };
};
