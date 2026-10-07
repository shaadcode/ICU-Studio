import { expect, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { createTextVariableDecorator } from '../stories/shared';
import TestVariables from '@/pages/landing/ui/Editor/TestVariables/TestVariables';
import { TEST_VARIABLES_ACCORDION_TRANSITION_DURATION } from '@/shared/lib/mantine';

const meta = {
  component: TestVariables,
  title: 'Editor/Test Variables/date',
} satisfies Meta<typeof TestVariables>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  decorators: createTextVariableDecorator({ message: `Date: {date, date, short}` }),
  play: async ({ step, canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'date date short' }));
    await step(
      'should select next week button',
      async ({ canvas, userEvent, canvasElement }) => {
        const button = canvasElement.querySelector('div:nth-of-type(6) > label');
        if (!button) {
          throw new Error('button is null');
        }
        await userEvent.click(button);
        await waitFor(async () => {
          const preview = await canvas.findByTestId('preview-value');
          const textContent = preview.textContent;
          // 9/8/26
          const parsedText = textContent.split('/');

          await expect(parsedText.length).toEqual(3);
        }, { interval: 200, timeout: TEST_VARIABLES_ACCORDION_TRANSITION_DURATION + 5000 });
      },
    );
  },
};
