import type { Meta, StoryObj } from '@storybook/react-vite';

import ICUEditor from '../../Editor';
import OneLineCopy from './OneLineCopy';

const meta = {
  component: OneLineCopy,
} satisfies Meta<typeof OneLineCopy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    Story => <ICUEditor custom={{ toolBarChildren: <Story /> }} />,
  ],
};
