import type { Meta, StoryObj } from '@storybook/react-vite';

import JsonPropertyCopy from './JSONPropertyCopy';
import MockRichTextEditor from '@/shared/lib/mantine/MockRichTextEditor';

const meta = {
  component: JsonPropertyCopy,
} satisfies Meta<typeof JsonPropertyCopy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    Story => <MockRichTextEditor control={<Story />} />,
  ],
};
