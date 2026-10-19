import { Grid, Stack } from '@mantine/core';

import { StructureDetails } from './StructureDetails';
import { BaseLocaleSelect } from './BaseLocaleSelect';
import { NamespacesTable } from './NamespacesTable/NamespacesTable';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { DetectedStructureTree } from './DetectedStructureTree/DetectedStructureTree';
import { DetectedLocalesSection } from './DetectedLocalesSection/DetectedLocalesSection';

type Props = {
  project: NonNullable<I18nManagerStore['selectedProject']>;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const StructureTab = ({
  project,
  projectData,
}: Props) => {
  return (
    <Grid gap="md">
      <Grid.Col span={{ lg: 4, base: 12 }}>
        <DetectedStructureTree projectData={projectData} />
      </Grid.Col>

      <Grid.Col span={{ lg: 8, base: 12 }}>
        <Stack gap="md">
          <StructureDetails projectData={projectData} />

          <DetectedLocalesSection projectData={projectData} />

          <NamespacesTable projectData={projectData} />

          <BaseLocaleSelect
            project={project}
            projectData={projectData}

          />
        </Stack>
      </Grid.Col>
    </Grid>
  );
};
