import type { Meta, StoryObj } from '@storybook/react-vite';

import ICUEditor from '../../Editor';
import SimpleCopy from './SimpleCopy';

const meta = {
  component: SimpleCopy,
} satisfies Meta<typeof SimpleCopy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    Story => <ICUEditor custom={{ toolBarChildren: <Story /> }} />,

  ],
};
