import { Group } from '@mantine/core';

import ICUEditorProblems from './Problems/Problems';
import TestVariablesWidget from './TestVariables/TestVariables';

const ICUEditorFooter = () => {
  return (
    <Group p="xs" h="100%">
      <ICUEditorProblems />
      <TestVariablesWidget />
    </Group>
  );
};

export default ICUEditorFooter;
