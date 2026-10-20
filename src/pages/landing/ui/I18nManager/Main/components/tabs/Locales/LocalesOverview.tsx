import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { Text, Stack, Alert, Center } from '@mantine/core';

import { SummaryCards } from './SummaryCards';
import { LocalesTable } from './LocalesTable/LocalesTable';
import { NamespacesTable } from './NamespacesTable/NamespacesTable';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export const LocalesOverview = () => {
  const t = useTranslations('i18nManager');
  const projectData = i18nManagerStore.use.selectedProjectData();
  const analysis = i18nManagerStore.use.selectedProjectAnalysis();

  const [selectedLocaleCode, setSelectedLocaleCode] = useState<string | undefined>(
    analysis?.baseLocale,
  );

  useEffect(() => {
    setSelectedLocaleCode(analysis?.baseLocale ?? undefined);
  }, [analysis?.baseLocale]);

  const hasBaseLocale = Boolean(analysis?.baseLocale);

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

  if (!projectData || !analysis) {
    return null;
  }

  const activeLocaleCode = selectedLocaleCode ?? analysis.baseLocale;
  const activeLocaleAnalysis = analysis.locales[activeLocaleCode];

  return (
    <Stack>
      <SummaryCards
        analysis={analysis}
        totalLocales={projectData.locales.length}
      />

      <LocalesTable
        analysis={analysis}
        projectData={projectData}
        selectedLocaleCode={activeLocaleCode}

        onSelectLocale={setSelectedLocaleCode}
      />

      <NamespacesTable
        projectData={projectData}
        localeCode={activeLocaleCode}
        localeAnalysis={activeLocaleAnalysis}
      />
    </Stack>
  );
};
