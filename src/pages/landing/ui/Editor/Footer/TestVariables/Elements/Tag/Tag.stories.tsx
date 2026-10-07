import type { Meta, StoryObj } from '@storybook/react-vite';

import { createTextVariableDecorator } from '../stories/shared';
import TestVariables from '@/pages/landing/ui/Editor/TestVariables/TestVariables';

const meta = {
  component: TestVariables,
  title: 'Editor/Test Variables/tag ',
} satisfies Meta<typeof TestVariables>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  decorators: createTextVariableDecorator({ message: `This is <b>very important</b> information` }),
};

export const MultipleTag: Story = {
  decorators: createTextVariableDecorator({ message: `Due: <b>date</b>. <link>Set reminder</link>` }),
};

export const WithSimpleVariable: Story = {
  decorators: createTextVariableDecorator({ message: `Due: <anchor>{count}</anchor>` }),
};
