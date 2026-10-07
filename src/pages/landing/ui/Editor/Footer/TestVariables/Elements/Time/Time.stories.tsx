import type { Meta, StoryObj } from '@storybook/react-vite';

import { createTextVariableDecorator } from '../stories/shared';
import TestVariables from '@/pages/landing/ui/Editor/TestVariables/TestVariables';

const meta = {
  component: TestVariables,
  title: 'Editor/Test Variables/time',
} satisfies Meta<typeof TestVariables>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  decorators: createTextVariableDecorator({ message: `Time: {time, time, short}` }),
};
