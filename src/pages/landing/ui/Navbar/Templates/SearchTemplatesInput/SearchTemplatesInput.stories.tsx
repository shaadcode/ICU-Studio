import type { Meta, StoryObj } from '@storybook/react-vite';

import SearchTemplatesInput from './SearchTemplatesInput';

const meta = {
  component: SearchTemplatesInput,
} satisfies Meta<typeof SearchTemplatesInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
