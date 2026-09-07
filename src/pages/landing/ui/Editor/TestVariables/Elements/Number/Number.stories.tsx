import { expect, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { createTextVariableDecorator } from '../stories/shared';
import TestVariables from '@/pages/landing/ui/Editor/TestVariables/TestVariables';
import { TEST_VARIABLES_ACCORDION_TRANSITION_DURATION } from '@/shared/lib/mantine';

const meta = {
  component: TestVariables,
  title: 'Editor/Test Variables/number',
} satisfies Meta<typeof TestVariables>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  decorators: createTextVariableDecorator({ message: `Total: {value, number}` }),

  play: async ({ step, canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'value number' }));
    await step('should select editor ', async ({ canvas, userEvent }) => {
      const input = canvas.getByPlaceholderText('number');
      await userEvent.clear(input);
      await userEvent.type(input, '313');
      await waitFor(async () => {
        const preview = await canvas.findByTestId('preview-value');

        await expect(preview).toHaveTextContent('Total: 313');
      }, { interval: 200, timeout: TEST_VARIABLES_ACCORDION_TRANSITION_DURATION + 5000 });
    });
  },
};

export const WithFormatting: Story = {
  decorators: createTextVariableDecorator({ message: `Rating: {rating, number, ::.0}` }),
  play: async ({ step, canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'rating number .0' }));
    await step('should select editor ', async ({ canvas, userEvent }) => {
      const input = canvas.getByPlaceholderText('number');
      await userEvent.clear(input);
      await userEvent.type(input, '4.888');
      await waitFor(async () => {
        const preview = await canvas.findByTestId('preview-value');

        await expect(preview).toHaveTextContent('Rating: 4.9');
      }, { interval: 200, timeout: TEST_VARIABLES_ACCORDION_TRANSITION_DURATION + 5000 });
    });
  },
};

export const WithMultipleFormatting: Story = {
  decorators: createTextVariableDecorator({ message: `Revenue: {amount, number, ::compact-short currency/USD}` }),

  play: async ({ step, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'amount number compact-short currency: USD' }));
    await step('should convert 15 to $15', async ({ canvas, userEvent }) => {
      const input = canvas.getByPlaceholderText('number');
      await userEvent.clear(input);
      await userEvent.type(input, '15');
      await waitFor(async () => {
        const preview = await canvas.findByTestId('preview-value');

        await expect(preview).toHaveTextContent('Revenue: $15');
      }, { interval: 200, timeout: TEST_VARIABLES_ACCORDION_TRANSITION_DURATION + 5000 });
    });
  },
};
