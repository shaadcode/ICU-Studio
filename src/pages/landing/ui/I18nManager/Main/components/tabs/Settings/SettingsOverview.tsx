import { Box, Grid } from '@mantine/core';

import { DefaultLocaleCard } from './DefaultLocaleCard';
import { ProjectInformationCard } from './ProjectInformationCard';
import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import type { BaseProjectInfo } from '../../../../Navbar/CreateNewProject/types';

type Props = {
  projectData: Project;
  project: BaseProjectInfo;
};
export function SettingsTab(props: Props) {
  return (
    <Box flex={1}>
      <Grid>
        <Grid.Col span={{ md: 7, base: 12 }}>
          <ProjectInformationCard projectData={props.projectData} />
        </Grid.Col>

        <Grid.Col span={{ md: 5, base: 12 }}>
          <DefaultLocaleCard {...props} />
        </Grid.Col>
      </Grid>
    </Box>
  );
}
