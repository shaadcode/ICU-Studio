import { Stack } from '@mantine/core';

import { RecentScans } from './RecentScans';
import { QuickActions } from './QuickActions/QuickActions';
import { TranslationCompleteness } from './TranslationCompleteness';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  project: NonNullable<I18nManagerStore['selectedProject']>;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const AnalysisSidebar = (params: Props) => {
  return (
    <Stack gap="md">
      <TranslationCompleteness projectData={params.projectData} />
      {/* <Recommendations
        recommendations={[{ description: 'hello', title: 'test recommend', key: 'defaultNamespace' }]}

        onLearnMoreNaming={onLearnMoreNaming}
        onAddDefaultNamespace={onAddDefaultNamespace}
      /> */}
      <QuickActions
        projectData={params.projectData}
      />
      <RecentScans project={params.project} projectData={params.projectData} />
    </Stack>
  );
};
