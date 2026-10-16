import { useState } from 'react';
import { attemptAsync } from 'es-toolkit';
import { useTranslations } from 'use-intl';
import { remove } from '@tauri-apps/plugin-fs';
import { notifications } from '@mantine/notifications';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { I18nProjectTree } from '@/shared/lib/mantine/getI18nProjectData';

export function useDetectedStructureTree() {
  const t = useTranslations('i18nManager');
  const [isLoading, setIsLoading] = useState(false);

  const selectedProjectData = i18nManagerStore.use.selectedProjectData();
  const setSelectedProjectData = i18nManagerStore.use.actions().setSelectedProjectData;

  const deleteLocale = async (project: I18nProjectTree) => {
    if (!selectedProjectData) {
      return;
    }

    setIsLoading(true);

    const [error] = await attemptAsync(async () => {
      await remove(project.fullPath, { recursive: true });

      const updatedTree = selectedProjectData.tree.filter(
        node => !(node.isDirectory && node.fullPath === project.fullPath),
      );

      const updatedLocales = selectedProjectData.locales.filter(
        l => l !== project.label,
      );

      const updatedBaseLocale
        = selectedProjectData.baseLocale === project.label
          ? updatedLocales[0] ?? ''
          : selectedProjectData.baseLocale;

      setSelectedProjectData({
        ...selectedProjectData,
        tree: updatedTree,
        locales: updatedLocales,
        baseLocale: updatedBaseLocale,
      });
    });

    setIsLoading(false);

    if (error) {
      notifications.show({
        color: 'red',
        title: t('structure.notifications.localeDeleteFailed.title'),
        message: error instanceof Error ? error.message : String(error),
      });
      return;
    }

    notifications.show({
      color: 'green',
      title: t('structure.notifications.localeDeleted.title'),
      message: t('structure.notifications.localeDeleted.message', {
        locale: String(project.label),
      }),
    });
  };

  return { isLoading, deleteLocale };
}
