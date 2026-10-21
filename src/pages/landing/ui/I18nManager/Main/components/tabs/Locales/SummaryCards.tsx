// components/tabs/Structure/SummaryCards.tsx
import { useTranslations } from 'use-intl';
import { Card, Text, Group, Stack, ThemeIcon, SimpleGrid } from '@mantine/core';
import { IconFlag, IconWorld, IconCheck, IconAlertTriangle } from '@tabler/icons-react';

import type { ProjectAnalysisResult } from '@/pages/landing/model/patterns/types';

type Props = {
  totalLocales: number;
  analysis: ProjectAnalysisResult;
};

export const SummaryCards = ({ analysis, totalLocales }: Props) => {
  const t = useTranslations('i18nManager');

  const incompleteCount = Object.values(analysis.locales).filter(
    l => l.completionPercentage < 100,
  ).length;

  const activeCount = totalLocales - incompleteCount;

  const cards = [
    {
      color: 'blue',
      icon: <IconWorld size={24} />,
      value: totalLocales.toString(),
      title: t('localesTab.summary.totalLocales'),
      sub: t('localesTab.summary.acrossNamespaces'),
    },
    {
      color: 'teal',
      value: activeCount.toString(),
      icon: <IconCheck size={24} />,
      title: t('localesTab.summary.active'),
      sub: `${((activeCount / totalLocales) * 100).toFixed(1)}%`,
    },
    {
      color: 'yellow',
      value: incompleteCount.toString(),
      icon: <IconAlertTriangle size={24} />,
      title: t('localesTab.summary.incomplete'),
      sub: `${((incompleteCount / totalLocales) * 100).toFixed(1)}%`,
    },
    {
      color: 'indigo',
      icon: <IconFlag size={24} />,
      title: t('structure.baseLocale'),
      value: analysis.baseLocale?.language.code ?? '-',
    },
  ];

  return (
    <SimpleGrid spacing="md" cols={{ sm: 2, lg: 4, base: 1 }}>
      {cards.map(card => (
        <Card withBorder radius="md" padding="md" key={card.title}>
          <Group align="flex-start" justify="space-between">
            <Stack gap={4}>
              <Text fw={500} size="xs" c="dimmed">
                {card.title}
              </Text>
              <Text fw={700} size="xl" tt="uppercase">
                {card.value}
              </Text>
              <Text size="xs" c="dimmed">
                {card.sub}
              </Text>
            </Stack>
            <ThemeIcon size={40} radius="md" variant="light" color={card.color}>
              {card.icon}
            </ThemeIcon>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
};
