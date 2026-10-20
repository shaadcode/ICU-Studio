import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';

export type I18nManagerTabKey = 'locales' | 'analysis' | 'settings' | 'structure' | 'namespaces';

export const useHandleI18nManagerMain = () => {
  const selectedProject = i18nManagerStore.use.selectedProject();
  const tCommon = useTranslations('common');
  const tI18nManager = useTranslations('i18nManager');
  const [activeTab, setActiveTab] = useState<I18nManagerTabKey>('structure');
  const selectedProjectData = i18nManagerStore.use.selectedProjectData();
  const projects = i18nManagerStore.use.projects();
  const loadSelectedProject = i18nManagerStore.use.actions().loadSelectedProject;

  useEffect(() => {
    if (selectedProject) {
      loadSelectedProject({
        tCommon,
        tI18nManager,
        project: selectedProject,
      });
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      (async () => {
        const patternActions = i18nManagerPatternsActions[selectedProject.structureType];

        await patternActions.handleWatchProject({ projectPath: selectedProject.projectPath });
      })();
    }
  }, [selectedProject]);

  return {
    projects,
    activeTab,
    setActiveTab,
    tI18nManager,
    selectedProject,
    selectedProjectData,
  };
};
