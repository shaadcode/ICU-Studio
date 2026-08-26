import type { Meta, StoryObj } from '@storybook/react-vite';

import ICUEditor from './Editor';

const meta = {
  component: ICUEditor,
} satisfies Meta<typeof ICUEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
