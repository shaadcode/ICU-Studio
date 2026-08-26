import type { Meta, StoryObj } from '@storybook/react-vite';

import ICUEditor from '../../Editor';
import PrettyCopy from './PrettyCopy';

const meta = {
  component: PrettyCopy,
} satisfies Meta<typeof PrettyCopy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    Story => <ICUEditor custom={{ toolBarChildren: <Story /> }} />,

  ],
};
