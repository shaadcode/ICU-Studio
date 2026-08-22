import type { Meta, StoryObj } from '@storybook/react-vite';

import PrettyCopy from './PrettyCopy';
import MockRichTextEditor from '@/shared/lib/mantine/MockRichTextEditor';

const meta = {
  component: PrettyCopy,
} satisfies Meta<typeof PrettyCopy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    Story => <MockRichTextEditor control={<Story />} />,
  ],
};
