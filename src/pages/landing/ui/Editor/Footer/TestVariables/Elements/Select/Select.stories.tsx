import { expect, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { createTextVariableDecorator } from '../stories/shared';
import TestVariables from '@/pages/landing/ui/Editor/TestVariables/TestVariables';
import { TEST_VARIABLES_ACCORDION_TRANSITION_DURATION } from '@/shared/lib/mantine';

const meta = {
  component: TestVariables,
  title: 'Editor/Test Variables/select',
} satisfies Meta<typeof TestVariables>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  decorators: createTextVariableDecorator({ message: `{role, select,
  admin {Full administrative access}
  editor {Can edit and publish content}
  viewer {Read-only access}
  other {Limited access}
}` }),

  play: async ({ step, canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'role select' }));
    await step('should select editor ', async ({ canvas, userEvent, canvasElement }) => {
      await userEvent.click(canvasElement.querySelector('div:nth-of-type(2) > label') as HTMLElement);

      await waitFor(async () => {
        const preview = await canvas.findByTestId('preview-value');

        await expect(preview).toHaveTextContent('Can edit and publish content');
      }, { interval: 200, timeout: TEST_VARIABLES_ACCORDION_TRANSITION_DURATION + 5000 });
    });
  },
};
