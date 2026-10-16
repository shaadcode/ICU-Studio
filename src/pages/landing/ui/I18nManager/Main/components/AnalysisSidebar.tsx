import { Stack } from '@mantine/core';

import { RecentScans } from './RecentScans';
import { QuickActions } from './QuickActions';
import { Recommendations } from './Recommendations';
import { TranslationCompleteness } from './TranslationCompleteness';
import { StructureInsights } from './tabs/Structure/StructureInsights';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  quickActions: any[];
  onRescan: () => void;
  onConvertCsv: () => void;
  onExportReport: () => void;
  onOpenExplorer: () => void;
  onLearnMoreNaming: () => void;
  onAddDefaultNamespace: () => void;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const AnalysisSidebar = ({
  projectData,
  quickActions,
  onConvertCsv,
  onExportReport,
  onOpenExplorer,
  onLearnMoreNaming,
  onAddDefaultNamespace,
}: Props) => {
  return (
    <Stack gap="md">
      <TranslationCompleteness analysis={projectData.messages} />
      <StructureInsights insights={{ message: 'analysis.insights' }} />
      <Recommendations
        recommendations={[{ description: 'hello', title: 'test recommend', key: 'defaultNamespace' }]}

        onLearnMoreNaming={onLearnMoreNaming}
        onAddDefaultNamespace={onAddDefaultNamespace}
      />
      <QuickActions
        actions={quickActions}

        onConvertCsv={onConvertCsv}
        onExportReport={onExportReport}
        onOpenExplorer={onOpenExplorer}
      />
      <RecentScans projectData={projectData} />
    </Stack>
  );
};
