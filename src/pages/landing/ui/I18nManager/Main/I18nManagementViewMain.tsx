import { Box, Tabs, Group, Stack, ScrollArea } from '@mantine/core';

import { ViewHeader } from './components/ViewHeader';
import { StatsCards } from './components/StatsCards';
import { ViewTabs } from './components/tabs/ViewTabs';
import { EmptyProjectsState } from './components/EmptyProjectState';
import { useHandleI18nManagerMain } from './useHandleI18nManagerMain';
import { EmptySelectionState } from './components/EmptySelectionState';
import { StructureTab } from './components/tabs/Structure/StructureTab';
import { LocalesOverview } from './components/tabs/Locales/LocalesOverview';

const I18nManagementViewMain = () => {
  const {
    projects,
    tI18nManager,
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
    <Stack flex={1} gap="md" h="100%">
      <ViewHeader
        title={tI18nManager('header.title')}
        scanLabel={tI18nManager('header.scanProject')}
        settingsLabel={tI18nManager('header.settings')}
        description={tI18nManager('header.description')}

      />

      <StatsCards />

      <ViewTabs>
        <Group
          mt="md"
          gap="md"
          wrap="nowrap"
          align="flex-start"
        >
          <ScrollArea h="100%" style={{ flex: 1, minWidth: 0 }}>
            <Tabs.Panel value="structure">
              <StructureTab
                project={selectedProject}
                projectData={selectedProjectData}

              />
            </Tabs.Panel>

            <Tabs.Panel value="locales">
              <LocalesOverview />
            </Tabs.Panel>

            <Tabs.Panel value="namespaces">
              <Box>{tI18nManager('tabs.namespacesContent')}</Box>
            </Tabs.Panel>

            <Tabs.Panel value="analysis">
              <Box>{tI18nManager('tabs.analysisContent')}</Box>
            </Tabs.Panel>

            <Tabs.Panel value="settings">
              <Box>{tI18nManager('tabs.settingsContent')}</Box>
            </Tabs.Panel>
          </ScrollArea>
        </Group>
      </ViewTabs>
    </Stack>
  );
};

export default I18nManagementViewMain;
