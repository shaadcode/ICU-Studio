import type { Meta, StoryObj } from '@storybook/react-vite';

import TfunctionCopy from './TFunctionCopy';
import MockRichTextEditor from '@/shared/lib/mantine/MockRichTextEditor';

const meta = {
  component: TfunctionCopy,
} satisfies Meta<typeof TfunctionCopy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    Story => <MockRichTextEditor control={<Story />} />,
  ],
};
