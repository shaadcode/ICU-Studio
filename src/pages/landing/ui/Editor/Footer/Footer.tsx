import { Group, Scroller } from '@mantine/core';

import ICUEditorProblemsWidgets from './Problems/Problems';
import { StatisticsWidget } from './Statistics/Statistics';
import TestVariablesWidget from './TestVariables/TestVariables';

const ICUEditorFooter = () => {
  return (
    <Scroller
      h="100%"
      styles={{
        content: { width: '100%', height: '100%' },
        container: { width: '100%', height: '100%' },
      }}
    >
      <Group grow p="xs" w="100%" h="100%" wrap="nowrap">
        <ICUEditorProblemsWidgets />
        <TestVariablesWidget />
        <StatisticsWidget />
      </Group>
    </Scroller>
  );
};

export default ICUEditorFooter;
