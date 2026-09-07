import type { Meta, StoryObj } from '@storybook/react-vite';

import Index from './index';

const meta = {
  component: Index,
  parameters: {
    withoutWrapper: true,
  },
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {

};
