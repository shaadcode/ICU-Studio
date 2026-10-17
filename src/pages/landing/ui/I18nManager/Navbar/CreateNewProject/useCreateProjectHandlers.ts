import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { useHotkeys, useDisclosure } from '@mantine/hooks';

import { hotkeys } from '@/shared/config/mantine/hotKeys';
import type { FileFormat, StructureType, ProjectSchema } from './types';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export const useCreateProjectHandlers = () => {
  const t = useTranslations('i18nManager');
  const tCommon = useTranslations('common');
  const [opened, modalHandlers] = useDisclosure(false);
  const i18nManagerLocalStore = i18nManagerStore.use.i18nManagerLocalStore();
  const addProject = i18nManagerStore.use.actions().addProject;

  const form = useForm<ProjectSchema>({
    mode: 'uncontrolled',
    validate: {
      name: value =>
        value.trim().length === 0 ? t('validation.createNewProject.nameRequired') : null,
    },
    initialValues: {
      name: '',
      baseLocale: '',
      description: '',
      baseDirectoryPath: '',
      structureType: 'locale-folder-namespace-file',
    },
  });

  const handleCreateProject = async (values: ProjectSchema) => {
    if (!i18nManagerLocalStore) {
      return;
    }
    if (values.structureType === 'locale-folder-namespace-file') {
      addProject({ tCommon, project: values, tI18nManager: t });
    }

    modalHandlers.close();
    form.reset();
  };

  const handleStructureSelect = (structure: StructureType) => {
    form.setFieldValue('structureType', structure);
  };

  const handleFormatSelect = (format: FileFormat) => {
    form.setFieldValue('fileFormat', format);
  };

  useHotkeys(
    [
      [
        hotkeys.i18nManager.newProject,
        modalHandlers.open,
      ],
    ],
    [],
    true,
  );

  return {
    t,
    form,
    opened,
    tCommon,
    modalHandlers,
    handleFormatSelect,
    handleCreateProject,
    handleStructureSelect,
  };
};
