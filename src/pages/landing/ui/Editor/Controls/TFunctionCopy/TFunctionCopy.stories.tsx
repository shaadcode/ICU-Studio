import type { Meta, StoryObj } from '@storybook/react-vite';

import ICUEditor from '../../Editor';
import TfunctionCopy from './TFunctionCopy';

const meta = {
  component: TfunctionCopy,
} satisfies Meta<typeof TfunctionCopy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    Story => <ICUEditor custom={{ toolBarChildren: <Story /> }} />,
  ],
};
