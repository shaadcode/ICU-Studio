import { uniqBy } from 'es-toolkit';
import { Stack } from '@mantine/core';
import { useState, useEffect } from 'react';

import { SummaryCards } from './SummaryCards';
import { NamespacesTable } from './NamespacesTable';
import { LocalesTable } from './LocalesTable/LocalesTable';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export const LocalesOverview = () => {
  const projectData = i18nManagerStore.use.selectedProjectData();
  const analysis = i18nManagerStore.use.selectedProjectAnalysis();
  const [selectedLocaleCode, setSelectedLocaleCode] = useState<string | undefined>(
    analysis?.baseLocale,
  );

  useEffect(() => {
    setSelectedLocaleCode(analysis?.baseLocale ?? undefined);
  }, [analysis?.baseLocale]);

  if (!projectData || !analysis) {
    return null;
  }

  const activeLocaleCode = selectedLocaleCode ?? analysis.baseLocale;

  const activeLocaleAnalysis = analysis.locales[activeLocaleCode];
  const uniqueNamespaces = uniqBy(projectData.namespaces, ns => ns.name);

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
        localeCode={activeLocaleCode}
        uniqueNamespaces={uniqueNamespaces}
        localeAnalysis={activeLocaleAnalysis}
      />
    </Stack>
  );
};
