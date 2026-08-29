import type { Meta, StoryObj } from '@storybook/react-vite';

import ICUEditor from '../../Editor';
import JsonPropertyCopy from './JSONPropertyCopy';

const meta = {
  component: JsonPropertyCopy,
  title: 'Editor/Controls/JsonPropertyCopy',
} satisfies Meta<typeof JsonPropertyCopy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    Story => <ICUEditor custom={{ toolBarChildren: <Story /> }} />,
  ],
};
