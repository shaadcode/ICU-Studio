import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { Box, Text, Stack, Alert, Center, Loader } from '@mantine/core';

import { SummaryCards } from './SummaryCards';
import { LocalesTable } from './LocalesTable/LocalesTable';
import { NamespacesTable } from './NamespacesTable/NamespacesTable';
import { MissingKeysTable } from './MissingKeysTable/MissingKeysTable';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { Locale } from '@/pages/landing/config/store/i18nManager/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  baseLocale: Locale;
  project: NonNullable<I18nManagerStore['selectedProject']>;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const LocalesOverview = (props: Props) => {
  const t = useTranslations('i18nManager');
  const analysis = i18nManagerStore.use.selectedProjectAnalysis();
  const analyzeProject = i18nManagerStore.use.actions().analyzeProject;
  const isAnalyzing = i18nManagerStore.use.isAnalyzing();

  const [selectedLocale, setSelectedLocale] = useState<Locale>(
    props.baseLocale,
  );

  useEffect(() => {
    if (!analysis) {
      analyzeProject();
    }
    setSelectedLocale(props.baseLocale ?? undefined);
  }, [props.baseLocale]);

  if (isAnalyzing) {
    return (
      <Box mt="xl" h="100%" flex={1}>
        <Center>
          <Stack gap="sm" align="center">
            <Loader size="md" />
            <Text size="sm" c="dimmed">
              {t('analysis.analyzing')}
            </Text>
          </Stack>
        </Center>
      </Box>
    );
  }

  const hasBaseLocale = Boolean(props.baseLocale.language.code);

  if (!hasBaseLocale) {
    return (
      <Center py="xl">
        <Alert
          maw={500}
          color="yellow"
          variant="light"
          icon={<IconAlertCircle size={16} />}
          title={t('localesTab.noBaseLocaleTitle')}
        >
          <Text size="sm">
            {t('localesTab.noBaseLocaleMessage')}
          </Text>
        </Alert>
      </Center>
    );
  }

  if (!analysis || !props.projectData) {
    return null;
  }

  const activeLocaleAnalysis = analysis.locales[selectedLocale.language.code];

  return (
    <Stack>
      <SummaryCards
        analysis={analysis}
        project={props.project}
        totalLocales={props.projectData.locales.length}
      />

      <LocalesTable
        analysis={analysis}
        project={props.project}
        projectData={props.projectData}
        selectedLocale={selectedLocale}

        onSelectLocale={setSelectedLocale}
      />

      <NamespacesTable
        project={props.project}
        projectData={props.projectData}
        selectedLocale={selectedLocale}
        localeAnalysis={activeLocaleAnalysis}
      />

      <MissingKeysTable
        analysis={analysis}
        baseLocale={props.baseLocale}
        selectedLocale={selectedLocale}
      />
    </Stack>
  );
};
