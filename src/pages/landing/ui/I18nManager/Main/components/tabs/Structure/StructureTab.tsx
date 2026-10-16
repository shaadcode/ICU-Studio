import { Grid, Stack } from '@mantine/core';

import { NamespacesTable } from './NamespacesTable';
import { StructureDetails } from './StructureDetails';
import { BaseLocaleSelect } from './BaseLocaleSelect';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { DetectedStructureTree } from './DetectedStructureTree/DetectedStructureTree';
import { DetectedLocalesSection } from './DetectedLocalesSection/DetectedLocalesSection';

type Props = {
  onAddNamespace: () => void;
  project: NonNullable<I18nManagerStore['selectedProject']>;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const StructureTab = ({
  project,
  projectData,
  onAddNamespace,
}: Props) => {
  return (
    <Grid gap="md">
      <Grid.Col span={{ lg: 4, base: 12 }}>
        <DetectedStructureTree
          projectData={projectData}

          onAddNamespace={onAddNamespace}
        />
      </Grid.Col>

      <Grid.Col span={{ lg: 8, base: 12 }}>
        <Stack gap="md">
          <StructureDetails />

          <DetectedLocalesSection projectData={projectData} />

          <NamespacesTable namespaces={projectData.namespaces} />

          <BaseLocaleSelect
            project={project}
            projectData={projectData}

          />
        </Stack>
      </Grid.Col>
    </Grid>
  );
};
