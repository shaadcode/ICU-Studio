import ISO6391 from 'iso-639-1';
import { useForm } from '@mantine/form';
import { attemptAsync } from 'es-toolkit';
import { useTranslations } from 'use-intl';
import { useDisclosure } from '@mantine/hooks';
import { useMemo, useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { StructureType } from '@/pages/landing/ui/I18nManager/Navbar/CreateNewProject/types';

export const ADD_LOCALE_STRATEGIES: Record<StructureType, AddLocaleStrategy>

  = {
    'locale-folder-namespace-file': async (ctx) => {

    },

    'namespace-path-prefix': async () => {
      throw new Error('Not implemented yet: namespace-path-prefix');
    },

    'locale-file-nested-namespaces': async () => {
      throw new Error('Not implemented yet: locale-file-nested-namespaces');
    },
  };

type FormValues = {
  localeCode: string;
};

const ALL_LOCALE_OPTIONS = ISO6391
  .getLanguages(ISO6391.getAllCodes())
  .map(lang => ({
    value: lang.code,
    label: `${lang.nativeName} — ${lang.name} (${lang.code})`,
  }));

type Params = {
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const useHandleAddLocaleModal = (params: Params) => {
  const t = useTranslations('i18nManager');
  const [isLoading, setIsLoading] = useState(false);
  const projectData = i18nManagerStore.use.selectedProjectData();
  const setSelectedProjectData = i18nManagerStore.use.actions().setSelectedProjectData;
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<FormValues>({
    initialValues: {
      localeCode: '',
    },
    validate: {
      localeCode: (value) => {
        if (!value) {
          return t('structure.validation.localeRequired');
        }
        if (params.projectData.locales.includes(value)) {
          return t('structure.validation.localeExists');
        }
        return null;
      },
    },
  });
  const addLocale = useCallback(
    async (params: { localeCode: string; localeName: string }) => {
      if (!projectData) {
        return;
      }

      setIsLoading(true);

      const [error] = await attemptAsync(async () => {
        const structureType = projectData.structureType as StructureType;
        const strategy = ADD_LOCALE_STRATEGIES[structureType];

        if (!strategy) {
          throw new Error(`Unknown structure type: ${structureType}`);
        }
        await strategy({
          ...projectData,
          setSelectedProjectData,
          newLocaleCode: params.localeCode,
          newLocaleLabel: params.localeName,
        });
      });

      setIsLoading(false);

      if (error) {
        notifications.show({
          color: 'red',
          title: t('structure.notifications.localeAddFailed.title'),
          message: error instanceof Error ? error.message : String(error),
        });
        return;
      }

      notifications.show({
        color: 'green',
        title: t('structure.notifications.localeAdded.title'),
        message: t(
          'structure.notifications.localeAdded.message',
          { locale: params.localeCode },
        ),
      });
      close();
    },
    [projectData, setSelectedProjectData, t],
  );

  const availableLocaleOptions = useMemo(
    () =>
      ALL_LOCALE_OPTIONS.filter(
        opt => !params.projectData.locales.includes(opt.value),
      ),
    [params.projectData.locales],
  );

  const handleSubmit = async (values: FormValues) => {
    const name = ISO6391.getName(values.localeCode) || values.localeCode;
    await addLocale({
      localeName: name,
      localeCode: values.localeCode,
    });
  };

  const handleClose = () => {
    form.reset();
    close();
  };

  const normalizedCode = form.values.localeCode;
  const previewFiles = normalizedCode ? params.projectData.namespaces : [];

  return {
    t,
    form,
    addLocale,
    isLoading,
    handleClose,
    handleSubmit,
    previewFiles,
    normalizedCode,
    openModal: open,
    openedModal: opened,
    availableLocaleOptions,

  };
};
