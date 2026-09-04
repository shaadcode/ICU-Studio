import { expect, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { createTextVariableDecorator } from '../stories/shared';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';
import TestVariables from '@/pages/landing/ui/Editor/TestVariables/TestVariables';

const meta = {
  component: TestVariables,
  title: 'Editor/Test Variables/simple-variable',
} satisfies Meta<typeof TestVariables>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  decorators: createTextVariableDecorator({ message: 'Hello, {name}!' }),

  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'name argument' }));
    const input = await canvas.findByPlaceholderText('value', { exact: true });

    await userEvent.clear(input);
    await userEvent.type(input, 'some text');

    waitFor(async () => {
      const preview = await canvas.findByTestId('preview-value');

      expect(preview).toHaveTextContent('Hello, some text!');
    }, { interval: 250, timeout: BOUNCE_UPDATE_VARIABLE_VALUE + 5000 });
  },
};

export const MultipleVariable: Story = {
  decorators: createTextVariableDecorator({ message: 'Welcome back, {firstName} {lastName}!' }),

  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'firstName argument' }));
    const firstNameInput = await canvas.findByDisplayValue('[firstName]', { exact: true });
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'john');

    await userEvent.click(await canvas.findByRole('button', { name: 'lastName argument' }));
    const lastNameInput = await canvas.findByDisplayValue('[lastName]', { exact: true });
    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, 'doe');

    waitFor(async () => {
      const preview = await canvas.findByTestId('preview-value');

      expect(preview).toHaveTextContent('Welcome back, john doe!');
    }, { interval: 250, timeout: BOUNCE_UPDATE_VARIABLE_VALUE + 100 });
  },
};
