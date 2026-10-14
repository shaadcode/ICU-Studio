import { Grid, Stack } from '@mantine/core';

import { NamespacesTable } from './NamespacesTable';
import { StructureDetails } from './StructureDetails';
import { BaseLocaleSelect } from './BaseLocaleSelect';
import { DetectedStructureTree } from './DetectedStructureTree';
import { DetectedLocalesSection } from './DetectedLocalesSection';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  onRescan: () => void;
  onAddLocale: () => void;
  onAddNamespace: () => void;
  onBaseLocaleChange: (locale: string) => void;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const StructureTab = ({
  onRescan,
  onAddLocale,
  projectData,
  onAddNamespace,
  onBaseLocaleChange,
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
          <StructureDetails onRescan={onRescan} />

          <DetectedLocalesSection
            locales={projectData.locales}

            onAddLocale={onAddLocale}
          />

          <NamespacesTable namespaces={projectData.namespaces} />

          <BaseLocaleSelect
            locales={projectData.locales}

            onChange={onBaseLocaleChange}
          />
        </Stack>
      </Grid.Col>
    </Grid>
  );
};
