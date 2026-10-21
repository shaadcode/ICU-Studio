import { useState } from 'react';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { useHotkeys, useDisclosure } from '@mantine/hooks';

import type { BaseProjectInfo } from './types';
import { hotkeys } from '@/shared/config/mantine/hotKeys';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export const useCreateProjectHandlers = () => {
  const tCommon = useTranslations('common');
  const t = useTranslations('i18nManager');
  const [opened, modalHandlers] = useDisclosure(false);
  const i18nManagerLocalStore = i18nManagerStore.use.i18nManagerLocalStore();
  const [hasLocale, setHasLocale] = useState(false);
  const addProject = i18nManagerStore.use.actions().addProject;

  const form = useForm<BaseProjectInfo>({
    mode: 'uncontrolled',
    validateInputOnBlur: true,
    initialValues: {
      name: '',
      path: '',
      description: '',
      baseLocale: undefined,
      structureType: 'locale-folder-namespace-file',
    },
    validate: {
      path: value =>
        value.trim().length === 0
          ? t('validation.createNewProject.pathRequired')
          : null,
      name: value =>
        value
          .trim()
          .length === 0
          ? t('validation.createNewProject.nameRequired')
          : null,
      baseLocale: (value) => {
        return hasLocale && !value
          ? t('validation.createNewProject.baseLocaleRequired')
          : null;
      },
    },
  });

  const handleCreateProject = async (values: BaseProjectInfo) => {
    if (!i18nManagerLocalStore) {
      return;
    }
    if (values.structureType === 'locale-folder-namespace-file') {
      await addProject({ tCommon, project: values, tI18nManager: t });
    }

    modalHandlers.close();
    form.reset();
  };

  useHotkeys(
    [[hotkeys.i18nManager.newProject, modalHandlers.open]],
    [],
    true,
  );

  return {
    t,
    form,
    opened,
    tCommon,
    hasLocale,
    setHasLocale,
    modalHandlers,
    handleCreateProject,
  };
};
