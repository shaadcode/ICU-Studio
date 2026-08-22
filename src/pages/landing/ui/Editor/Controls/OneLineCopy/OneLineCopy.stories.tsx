import type { Meta, StoryObj } from '@storybook/react-vite';

import OneLineCopy from './OneLineCopy';
import MockRichTextEditor from '@/shared/lib/mantine/MockRichTextEditor';

const meta = {
  component: OneLineCopy,
} satisfies Meta<typeof OneLineCopy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    Story => <MockRichTextEditor control={<Story />} />,
  ],
};
