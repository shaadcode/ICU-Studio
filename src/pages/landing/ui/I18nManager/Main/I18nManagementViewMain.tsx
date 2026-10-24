import { Box, Tabs, Text, Stack, Center, Loader, ScrollArea } from '@mantine/core';

import { ViewHeader } from './components/ViewHeader';
import { ViewTabs } from './components/tabs/ViewTabs';
import JsonEditor from './components/JsonEditor/JsonEditor';
import { EmptyBaseLocaleState } from './EmptyBaseLocaleState';
import { EmptyProjectsState } from './components/EmptyProjectState';
import { useHandleI18nManagerMain } from './useHandleI18nManagerMain';
import { EmptySelectionState } from './components/EmptySelectionState';
import { StructureTab } from './components/tabs/Structure/StructureTab';
import { SettingsTab } from './components/tabs/Settings/SettingsOverview';
import { LocalesOverview } from './components/tabs/Locales/LocalesOverview';

const I18nManagementViewMain = () => {
  const {
    projects,
    baseLocale,
    tI18nManager,
    loadingProject,
    selectedProject,
    selectedProjectData,
    jsonEditorEntityData,
  } = useHandleI18nManagerMain();

  if (loadingProject) {
    return (
      <Box flex={1}>
        <Center h="100%">
          <Stack gap="sm" align="center" justify="center">
            <Loader size="lg" />
            <Text size="sm" c="dimmed">
              {tI18nManager('loading.project')}
            </Text>
          </Stack>
        </Center>
      </Box>
    );
  }

  if (projects.length === 0) {
    return <EmptyProjectsState />;
  }

  if (!selectedProjectData || !selectedProject) {
    return <EmptySelectionState />;
  }

  if (!baseLocale) {
    return <EmptyBaseLocaleState />;
  }

  return (
    <Box flex={1}>
      {jsonEditorEntityData
        ? <JsonEditor />
        : (
            <Stack gap="md" h="100%">
              <ViewHeader
                title={tI18nManager('header.title')}
                scanLabel={tI18nManager('header.scanProject')}
                settingsLabel={tI18nManager('header.settings')}
                description={tI18nManager('header.description')}

              />

              {/* <StatsCards /> */}

              <ViewTabs>
                <Box pt="xs">
                  <ScrollArea h="100%" style={{ flex: 1, minWidth: 0 }}>
                    <Tabs.Panel value="structure">
                      <StructureTab
                        project={selectedProject}
                        projectData={selectedProjectData}

                      />
                    </Tabs.Panel>

                    <Tabs.Panel value="locales">
                      <LocalesOverview
                        baseLocale={baseLocale}
                        project={selectedProject}
                        projectData={selectedProjectData}
                      />
                    </Tabs.Panel>

                    <Tabs.Panel value="namespaces">
                      <Box>{tI18nManager('tabs.namespacesContent')}</Box>
                    </Tabs.Panel>

                    <Tabs.Panel value="analysis">
                      <Box>{tI18nManager('tabs.analysisContent')}</Box>
                    </Tabs.Panel>

                    <Tabs.Panel value="settings">
                      <SettingsTab
                        project={selectedProject}
                        projectData={selectedProjectData}
                      />
                    </Tabs.Panel>
                  </ScrollArea>
                </Box>
              </ViewTabs>
            </Stack>
          )}

    </Box>
  );
};

export default I18nManagementViewMain;
