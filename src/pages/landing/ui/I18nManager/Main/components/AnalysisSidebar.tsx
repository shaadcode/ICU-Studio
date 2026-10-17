import { Stack } from '@mantine/core';

import { RecentScans } from './RecentScans';
import { QuickActions } from './QuickActions/QuickActions';
import { TranslationCompleteness } from './TranslationCompleteness';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  onRescan: () => void;
  onConvertCsv: () => void;
  onExportReport: () => void;
  onOpenExplorer: () => void;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const AnalysisSidebar = ({
  projectData,
}: Props) => {
  return (
    <Stack gap="md">
      <TranslationCompleteness projectData={projectData} />
      {/* <Recommendations
        recommendations={[{ description: 'hello', title: 'test recommend', key: 'defaultNamespace' }]}

        onLearnMoreNaming={onLearnMoreNaming}
        onAddDefaultNamespace={onAddDefaultNamespace}
      /> */}
      <QuickActions
        projectData={projectData}
      />
      <RecentScans projectData={projectData} />
    </Stack>
  );
};
