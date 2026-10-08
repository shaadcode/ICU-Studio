import { Group } from '@mantine/core';

import ICUEditorProblems from './Problems/Problems';
import { StatisticsWidget } from './Statistics/Statistics';
import TestVariablesWidget from './TestVariables/TestVariables';

const ICUEditorFooter = () => {
  return (
    <Group p="xs" h="100%">
      <ICUEditorProblems />
      <TestVariablesWidget />
      <StatisticsWidget />
    </Group>
  );
};

export default ICUEditorFooter;
