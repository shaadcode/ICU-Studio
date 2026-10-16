import { Box, Tabs, Group, Stack, ScrollArea } from '@mantine/core';

import { ViewHeader } from './components/ViewHeader';
import { StatsCards } from './components/StatsCards';
import { ViewTabs } from './components/tabs/ViewTabs';
import { AnalysisSidebar } from './components/AnalysisSidebar';
import { EmptyProjectsState } from './components/EmptyProjectState';
import { useHandleI18nManagerMain } from './useHandleI18nManagerMain';
import { EmptySelectionState } from './components/EmptySelectionState';
import { StructureTab } from './components/tabs/Structure/StructureTab';

const I18nManagementViewMain = () => {
  const {
    t,
    handlers,
    projects,
    activeTab,
    setActiveTab,
    quickActions,
    selectedProject,
    selectedProjectData,
  } = useHandleI18nManagerMain();

  if (projects.length === 0) {
    return <EmptyProjectsState />;
  }

  if (!selectedProjectData || !selectedProject) {
    return <EmptySelectionState />;
  }

  return (
    <Stack gap="md" h="100%">
      <ViewHeader
        title={t('i18nManager.header.title')}
        scanLabel={t('i18nManager.header.scanProject')}
        settingsLabel={t('i18nManager.header.settings')}
        description={t('i18nManager.header.description')}

        onScan={handlers.handleScan}
        onSettings={handlers.handleOpenSettings}
      />

      <StatsCards />

      <ViewTabs
        activeTab={activeTab}

        onChange={setActiveTab}
      >
        <Group
          gap="md"
          wrap="nowrap"
          align="flex-start"
          style={{ flex: 1, minHeight: 0, marginTop: 'var(--mantine-spacing-md)' }}
        >
          <ScrollArea h="100%" style={{ flex: 1, minWidth: 0 }}>
            <Tabs.Panel value="structure">
              <StructureTab
                project={selectedProject}
                projectData={selectedProjectData}

                onAddNamespace={handlers.handleAddNamespace}
              />
            </Tabs.Panel>

            <Tabs.Panel value="locales">
              <Box>{t('i18nManager.tabs.localesContent')}</Box>
            </Tabs.Panel>

            <Tabs.Panel value="namespaces">
              <Box>{t('i18nManager.tabs.namespacesContent')}</Box>
            </Tabs.Panel>

            <Tabs.Panel value="analysis">
              <Box>{t('i18nManager.tabs.analysisContent')}</Box>
            </Tabs.Panel>

            <Tabs.Panel value="settings">
              <Box>{t('i18nManager.tabs.settingsContent')}</Box>
            </Tabs.Panel>
          </ScrollArea>

          <Box w={320} style={{ flexShrink: 0 }}>
            <ScrollArea h="100%">
              <AnalysisSidebar
                quickActions={quickActions}
                projectData={selectedProjectData}

                onRescan={handlers.handleRescan}
                onConvertCsv={handlers.handleConvertCsv}
                onExportReport={handlers.handleExportReport}
                onOpenExplorer={handlers.handleOpenExplorer}
                onLearnMoreNaming={handlers.handleLearnMoreNaming}
                onAddDefaultNamespace={handlers.handleAddDefaultNamespace}
              />
            </ScrollArea>
          </Box>
        </Group>
      </ViewTabs>
    </Stack>
  );
};

export default I18nManagementViewMain;
