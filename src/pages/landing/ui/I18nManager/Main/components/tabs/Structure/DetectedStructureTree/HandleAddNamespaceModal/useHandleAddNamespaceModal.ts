// components/modals/useHandleAddNamespaceModal.ts
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';
import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import type { BaseProjectInfo } from '@/pages/landing/ui/I18nManager/Navbar/CreateNewProject/types';

type FormValues = {
  namespaceName: string;
};

type Params = {
  projectData: Project;
  project: BaseProjectInfo;
};

export const useHandleAddNamespaceModal = (rootParams: Params) => {
  const t = useTranslations('i18nManager');
  const setSelectedProjectData = i18nManagerStore.use.actions().setSelectedProjectData;
  const setStopWatchingLocalesAndNamespacesFns = i18nManagerStore.use.actions().setStopWatchingLocalesAndNamespacesFns;
  const setProjectAnalysis = i18nManagerStore.use.actions().setProjectAnalysis;
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<FormValues>({
    initialValues: {
      namespaceName: '',
    },
    validate: {
      namespaceName: (newNamespace) => {
        if (!newNamespace.trim()) {
          return t('structure.validation.namespaceRequired');
        }
        if (rootParams.projectData.namespaces.some(ns => ns.name === newNamespace.trim())) {
          return t('structure.validation.namespaceExists');
        }
        if (!/^[a-z0-9-]+$/i.test(newNamespace.trim())) {
          return t('structure.validation.namespaceInvalid');
        }
        return null;
      },
    },
  });

  const addNamespace = async (params: { namespaceName: string }) => {
    const patternActions = i18nManagerPatternsActions[rootParams.projectData.structureType];

    if (!rootParams.project.baseLocale) {
      console.error('baseLocale is undefined for add namespace');
      return;
    }

    const [error] = await patternActions.addNamespace({
      setProjectAnalysis,
      setSelectedProjectData,
      namespace: params.namespaceName,
      projectData: rootParams.projectData,
      setStopWatchingLocalesAndNamespacesFns,
      baseLocale: rootParams.project.baseLocale,
    });

    if (error) {
      notifications.show({
        color: 'red',
        title: t('structure.notifications.namespaceAddFailed.title'),
        message: error instanceof Error ? error.message : String(error),
      });
      return;
    }

    notifications.show({
      color: 'green',
      title: t('structure.notifications.namespaceAdded.title'),
      message: t(
        'structure.notifications.namespaceAdded.message',
        { namespace: params.namespaceName },
      ),
    });
    handleClose();
  };

  const handleSubmit = async (values: FormValues) => {
    await addNamespace({
      namespaceName: values.namespaceName.trim(),
    });
  };

  function handleClose() {
    form.reset();
    close();
  };

  return {
    t,
    form,
    handleClose,
    addNamespace,
    handleSubmit,
    openModal: open,
    openedModal: opened,
    normalizedName: form.values.namespaceName.trim(),
  };
};
