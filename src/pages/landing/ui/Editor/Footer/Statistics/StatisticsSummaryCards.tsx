import { memo } from 'react';
import { Group } from '@mantine/core';
import { useTranslations } from 'use-intl';

import { StatCard } from './StatCard';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

export const StatisticsSummaryCards = memo(() => {
  const stats = icuEditorStore.use.stats();
  const t = useTranslations('editor');

  return (
    <Group grow gap="xs" wrap="nowrap" align="stretch">
      <StatCard value={stats.characters} label={t('widgets.statistics.stats.characters')} />
      <StatCard value={stats.words} label={t('widgets.statistics.stats.words')} />
      <StatCard value={stats.variables.size} label={t('widgets.statistics.stats.variables')} />
      <StatCard
        value={`${stats.icuSyntaxRatio}%`}
        label={t('widgets.statistics.stats.icuSyntaxRatio')}
      />
    </Group>
  );
});

StatisticsSummaryCards.displayName = 'StatisticsSummaryCards';
