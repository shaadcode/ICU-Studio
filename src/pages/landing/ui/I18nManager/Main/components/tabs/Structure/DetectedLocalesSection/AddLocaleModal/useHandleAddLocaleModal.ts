import ISO6391 from 'iso-639-1';
import { useMemo } from 'react';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

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

export const useHandleAddLocaleModal = (rootParams: Params) => {
  const t = useTranslations('i18nManager');
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
        if (rootParams.projectData.locales.some(l => l.language.code === value)) {
          return t('structure.validation.localeExists');
        }
        return null;
      },
    },
  });
  const addLocale
    = async (params: { localeCode: string; localeName: string }) => {
      const patternActions = i18nManagerPatternsActions[rootParams.projectData.structureType];
      const [error] = await patternActions.addLocale({
        ...rootParams.projectData,
        setSelectedProjectData,
        newLocaleCode: params.localeCode,
        newLocaleLabel: params.localeName,
      });

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
    };

  const availableLocaleOptions = useMemo(
    () =>
      ALL_LOCALE_OPTIONS.filter(
        opt => !rootParams.projectData.locales.some(l => opt.value === l.language.code),
      ),
    [rootParams.projectData.locales],
  );

  const handleSubmit = async (values: FormValues) => {
    const name = ISO6391.getName(values.localeCode) || values.localeCode;
    await addLocale({
      localeName: name,
      localeCode: values.localeCode,
    });

    handleClose();
  };

  function handleClose() {
    form.reset();
    close();
  };

  const normalizedCode = form.values.localeCode;
  const previewFiles = normalizedCode ? rootParams.projectData.namespaces : [];

  return {
    t,
    form,
    addLocale,
    handleClose,
    handleSubmit,
    previewFiles,
    normalizedCode,
    openModal: open,
    openedModal: opened,
    availableLocaleOptions,
  };
};
