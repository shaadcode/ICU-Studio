import { useTranslations } from 'use-intl';
import { Tabs, Stack } from '@mantine/core';
import type { TabsTabProps, TabsPanelProps } from '@mantine/core';
import {
  IconChartPie,
  IconFlask2Filled,
  IconAlertHexagonFilled,
} from '@tabler/icons-react';

import { MOBILE_BREAKPOINT } from '@/shared/lib/mantine';
import ICUEditorProblemsWidgets from '../Footer/Problems/Problems';
import { StatisticsWidget } from '../Footer/Statistics/Statistics';
import { VariablesWidget } from './Widgets/Variables/VariablesWidget';
import TestVariablesWidget from '../Footer/TestVariables/TestVariables';

type Widgets = 'preview' | 'problems' | 'variables' | 'statistics';

const ICUEditorAside = () => {
  const t = useTranslations('editor');
  const tCommon = useTranslations('common');

  const tabs = [
    {
      value: 'problems',
      label: tCommon('problem', { count: 2 }),
      component: <ICUEditorProblemsWidgets />,
      tabProps: { hiddenFrom: MOBILE_BREAKPOINT },
      panelProps: { hiddenFrom: MOBILE_BREAKPOINT },
      icon: <IconAlertHexagonFilled size={14} color="var(--mantine-color-red-6)" />,
    },
    {
      value: 'preview',
      label: tCommon('preview'),
      component: <TestVariablesWidget />,
      tabProps: { hiddenFrom: MOBILE_BREAKPOINT },
      panelProps: { hiddenFrom: MOBILE_BREAKPOINT },
      icon: <IconFlask2Filled size={14} color="var(--mantine-color-green-6)" />,
    },
    {
      value: 'statistics',
      component: <StatisticsWidget />,
      label: t('widgets.statistics.title'),
      tabProps: { hiddenFrom: MOBILE_BREAKPOINT },
      panelProps: { hiddenFrom: MOBILE_BREAKPOINT },
      icon: <IconChartPie size={14} color="var(--mantine-color-blue-6)" />,
    },
  ] as const satisfies Array<{
    icon: any;
    label: string;
    value: Widgets;
    component: any;
    tabProps?: Omit<TabsTabProps, 'value' | 'children'>;
    panelProps?: Omit<TabsPanelProps, 'value' | 'children'>;
  }>;

  return (
    <Stack p="sm" h="100%">
      <VariablesWidget />
      <Tabs
        h="100%"
        defaultValue="problems"
        style={{ overflow: 'auto' }}
      >
        <Tabs.List>
          {tabs.map(tab => (
            <Tabs.Tab
              key={tab.value}
              value={tab.value}
              leftSection={tab.icon}
              {...tab?.tabProps}
            >
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {tabs.map(tab => (
          <Tabs.Panel
            py="xs"
            key={tab.value}
            value={tab.value}
            h="calc(100% - 36px)"
            {...tab.panelProps}
          >
            {tab.component}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Stack>
  );
};

export default ICUEditorAside;
