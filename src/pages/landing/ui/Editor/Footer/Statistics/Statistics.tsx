import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { IconChartPie } from '@tabler/icons-react';
import { Stack, ScrollAreaAutosize } from '@mantine/core';

import WidgetHeader from '../../WidgetHeader';
import { UnformattedState } from './UnformattedState';
import { MOBILE_BREAKPOINT } from '@/shared/lib/mantine';
import { CurrentMessageCard } from './CurrentMessageCard';
import { StatisticsEmptyState } from './StatisticsEmptyState';
import { ValidationErrorState } from './ValidationErrorState';
import { StatisticsSummaryCards } from './StatisticsSummaryCards';
import WidgetContainer from '../../WidgetContainer/WidgetContainer';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

export const StatisticsWidget = memo(() => {
  const t = useTranslations('editor');

  const validationError = icuEditorStore.use.validationError();
  const isEmpty = icuEditorStore.use.isEmpty();
  const isFormatted = icuEditorStore.use.isFormatted();

  const renderState = () => {
    if (validationError) {
      return <ValidationErrorState />;
    }

    if (isEmpty) {
      return <StatisticsEmptyState />;
    }

    if (!isFormatted) {
      return <UnformattedState />;
    }

    return (
      <>
        <StatisticsSummaryCards />
        <CurrentMessageCard />
      </>
    );
  };

  return (
    <WidgetContainer pr={0} mih={0} mod={{ 'data-footer-widget': true }}>
      <ScrollAreaAutosize
        h="100%"
        mah="100%"
        scrollbars="y"
        offsetScrollbars
      >
        <Stack gap="sm" h="100%">
          <WidgetHeader
            label={t('widgets.statistics.title')}
            containerProps={{ visibleFrom: MOBILE_BREAKPOINT }}
            icon={props => <IconChartPie color="var(--mantine-color-blue-6)" {...props} />}
          />

          {renderState()}
        </Stack>
      </ScrollAreaAutosize>
    </WidgetContainer>
  );
});

StatisticsWidget.displayName = 'StatisticsWidget';
