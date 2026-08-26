import type { Meta, StoryObj } from '@storybook/react-vite';

import ICUEditor from '../../Editor';
import JsonPropertyPaste from './JSONPropertyPaste';

const meta = {
  component: JsonPropertyPaste,
} satisfies Meta<typeof JsonPropertyPaste>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Det: Story = {
  decorators: [Story => <ICUEditor custom={{ toolBarChildren: <Story /> }} />,

  ],
};
