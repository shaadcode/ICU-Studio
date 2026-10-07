import { Box } from '@mantine/core';
import type { Decorator } from '@storybook/react-vite';

import { minimalParser } from '@/shared/lib/icu';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

type Params = {
  message: string;
};
export const createTextVariableDecorator: (params: Params) => Decorator = params => (Story) => {
  const [, parsedMessage] = minimalParser(params.message);
  if (!parsedMessage) {
    throw new Error('parsedMessage is Null(test variables section)');
  }
  icuEditorStore.use.actions().setParsedMessage(parsedMessage);
  icuEditorStore.use.actions().setVariables(parsedMessage);

  return (
    <Box w="100%">
      <Story />
    </Box>
  );
};
