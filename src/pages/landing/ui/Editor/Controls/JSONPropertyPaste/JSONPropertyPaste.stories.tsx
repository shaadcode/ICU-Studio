import type { Meta, StoryObj } from '@storybook/react-vite';

import JsonPropertyPaste from './JSONPropertyPaste';
import MockRichTextEditor from '@/shared/lib/mantine/MockRichTextEditor';

const meta = {
  component: JsonPropertyPaste,
} satisfies Meta<typeof JsonPropertyPaste>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    Story => <MockRichTextEditor control={<Story />} />,
  ],
};
