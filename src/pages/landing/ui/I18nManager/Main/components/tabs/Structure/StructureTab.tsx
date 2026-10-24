import { Grid, Stack } from '@mantine/core';

import { StructureDetails } from './StructureDetails';
import { BaseLocaleSelect } from './BaseLocaleSelect';
import { NamespacesTable } from './NamespacesTable/NamespacesTable';
import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import type { BaseProjectInfo } from '../../../../Navbar/CreateNewProject/types';
import { DetectedStructureTree } from './DetectedStructureTree/DetectedStructureTree';
import { DetectedLocalesSection } from './DetectedLocalesSection/DetectedLocalesSection';

type Props = {
  projectData: Project;
  project: BaseProjectInfo;
};

export const StructureTab = ({
  project,
  projectData,
}: Props) => {
  return (
    <Grid gap="md">
      <Grid.Col span={{ lg: 4, base: 12 }}>
        <DetectedStructureTree project={project} projectData={projectData} />
      </Grid.Col>

      <Grid.Col span={{ lg: 8, base: 12 }}>
        <Stack gap="md">
          <StructureDetails projectData={projectData} />

          <DetectedLocalesSection
            project={project}
            projectData={projectData}
          />

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
