import { Group } from '@mantine/core';

import ICUEditorProblemsWidgets from './Problems/Problems';
import { StatisticsWidget } from './Statistics/Statistics';
import TestVariablesWidget from './TestVariables/TestVariables';

const ICUEditorFooter = () => {
  return (
    <Group p="xs" h="100%">
      <ICUEditorProblemsWidgets />
      <TestVariablesWidget />
      <StatisticsWidget />
    </Group>
  );
};

export default ICUEditorFooter;
