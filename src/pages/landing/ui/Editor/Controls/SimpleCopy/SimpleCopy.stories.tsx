import type { Meta, StoryObj } from '@storybook/react-vite';

import SimpleCopy from './SimpleCopy';
import MockRichTextEditor from '@/shared/lib/mantine/MockRichTextEditor';

const meta = {
  component: SimpleCopy,
} satisfies Meta<typeof SimpleCopy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    Story => <MockRichTextEditor control={<Story />} />,
  ],
};
