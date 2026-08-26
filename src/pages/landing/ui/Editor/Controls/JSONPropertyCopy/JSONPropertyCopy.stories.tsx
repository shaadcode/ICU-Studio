import { expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import ICUEditor from '../../Editor';
import JsonPropertyCopy from './JSONPropertyCopy';

const meta = {
  component: JsonPropertyCopy,
} satisfies Meta<typeof JsonPropertyCopy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async () => {
    await expect(5 + 5).toEqual(10);
  },
  decorators: [
    Story => <ICUEditor custom={{ toolBarChildren: <Story /> }} />,

  ],
};
