import { expect, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { createTextVariableDecorator } from '../stories/shared';
import TestVariables from '@/pages/landing/ui/Editor/TestVariables/TestVariables';
import { TEST_VARIABLES_ACCORDION_TRANSITION_DURATION } from '@/shared/lib/mantine';

const meta = {
  component: TestVariables,
  title: 'Editor/Test Variables/plural',
} satisfies Meta<typeof TestVariables>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  decorators: createTextVariableDecorator({ message: `{count, plural,
  =0 {No items}
  one {1 item}
  other {# items}
}` }),

  play: async ({ step, canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole(
      'button',
      { name: 'count plural offset: 0 plural type: cardinal' },
    ));
    await step('5 items', async ({ canvas, userEvent }) => {
      const input = await canvas.findByPlaceholderText('number', { exact: true });

      await userEvent.clear(input);
      await userEvent.type(input, '5');

      await waitFor(async () => {
        const preview = await canvas.findByTestId('preview-value');

        await expect(preview).toHaveTextContent('5 items');
      }, { interval: 200, timeout: TEST_VARIABLES_ACCORDION_TRANSITION_DURATION + 5000 });
    });

    await step('No items', async ({ canvas, userEvent }) => {
      const input = await canvas.findByPlaceholderText('number', { exact: true });

      await userEvent.clear(input);
      await userEvent.type(input, '0');

      await waitFor(async () => {
        const preview = await canvas.findByTestId('preview-value');

        await expect(preview).toHaveTextContent('No items');
      }, { interval: 100, timeout: TEST_VARIABLES_ACCORDION_TRANSITION_DURATION + 5000 });
    });
  },
};

export const Ordinal: Story = {
  decorators: createTextVariableDecorator({ message: `You finished in {position, selectordinal,
  one {#st}
  two {#nd}
  few {#rd}
  other {#th}
} place!` }),

  play: async ({ step, canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole(
      'button',
      { name: 'position plural offset: 0 plural type: ordinal' },
    ));
    await step('should select 2 and display "nd"', async ({ canvas, userEvent }) => {
      const input = await canvas.findByPlaceholderText('number', { exact: true });

      await userEvent.clear(input);
      await userEvent.type(input, '2');

      await waitFor(async () => {
        const preview = await canvas.findByTestId('preview-value');

        await expect(preview).toHaveTextContent('You finished in 2nd place!');
      }, { interval: 200, timeout: TEST_VARIABLES_ACCORDION_TRANSITION_DURATION + 5000 });
    });
  },
};

export const Multiple: Story = {
  decorators: createTextVariableDecorator({ message: `{count, plural,
  =0 {No items}
  one {1 item}
  other {# items}
}` }),

  play: async ({ step, canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole(
      'button',
      { name: 'count plural offset: 0 plural type: cardinal' },
    ));
    await step('5 items', async ({ canvas, userEvent }) => {
      const input = await canvas.findByPlaceholderText('number', { exact: true });

      await userEvent.clear(input);
      await userEvent.type(input, '5');

      await waitFor(async () => {
        const preview = await canvas.findByTestId('preview-value');

        await expect(preview).toHaveTextContent('5 items');
      }, { interval: 200, timeout: TEST_VARIABLES_ACCORDION_TRANSITION_DURATION + 5000 });
    });

    await step('No items', async ({ canvas, userEvent }) => {
      const input = await canvas.findByPlaceholderText('number', { exact: true });

      await userEvent.clear(input);
      await userEvent.type(input, '0');

      await waitFor(async () => {
        const preview = await canvas.findByTestId('preview-value');

        await expect(preview).toHaveTextContent('No items');
      }, { interval: 100, timeout: TEST_VARIABLES_ACCORDION_TRANSITION_DURATION + 5000 });
    });

    await step('check segmented control', async ({ canvas, userEvent, canvasElement }) => {
      const segmentedButton = canvasElement.querySelector('div:nth-of-type(3) > label');
      if (!segmentedButton) {
        throw new Error('Segmented button not found!');
      }
      await userEvent.click(segmentedButton);

      await expect(canvas.queryByRole('radiogroup')).toBeVisible();

      await waitFor(async () => {
        const preview = await canvas.findByTestId('preview-value');

        await expect(preview).toHaveTextContent('2 items');
      }, { interval: 100, timeout: TEST_VARIABLES_ACCORDION_TRANSITION_DURATION + 5000 });
    });
  },
};

export const WithOffset: Story = {
  decorators: createTextVariableDecorator({ message: `{count, plural, offset:1
  =1 {You commented on this}
  one {You and {name} commented on this}
  other {You and # others commented on this}
}` }),

  play: async ({ step }) => {
    await step(
      'should display two accordion item',
      async ({ canvasElement }) => {
        const accordionItems = canvasElement.querySelectorAll('.mantine-Accordion-item');

        await expect(accordionItems.length).toEqual(2);
      },
    );

    // await step(
    //   'Interaction with both inputs',
    //   async ({ canvas, userEvent }) => {
    //     await userEvent.click(await canvas.findByRole('button', { name: 'count plural offset: 1 plural type: cardinal' }));
    //     await userEvent.click(await canvas.findByRole('button', { name: 'name argument' }));

    //     const PluralInput = await canvas.findByPlaceholderText('number', { exact: true });
    //     await userEvent.clear(PluralInput);
    //     await userEvent.type(PluralInput, '2');

    //     const argumentInput = await canvas.findByPlaceholderText('value', { exact: true });
    //     await userEvent.clear(argumentInput);
    //     await userEvent.type(argumentInput, 'john');

    //     await waitFor(async () => {
    //       const preview = await canvas.findByTestId('preview-value');

    //       await expect(preview).toHaveTextContent('You and john commented on this');
    //     }, { interval: 200, timeout: TEST_VARIABLES_ACCORDION_TRANSITION_DURATION + 5000 });
    //   },
    // );
  },
};
