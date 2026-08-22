import type { Meta, StoryObj } from '@storybook/react-vite';

import TemplateBox from './TemplateBox';

const meta = {
  component: TemplateBox,
} satisfies Meta<typeof TemplateBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      id: 1,
      name: 'name',
      category: 'time',
      content: 'content',
    },
  },
};
