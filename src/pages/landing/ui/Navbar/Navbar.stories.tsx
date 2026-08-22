import { Box } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import Navbar from './Navbar';

const meta = {
  component: Navbar,
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    Story => (
      <Box h={600}>
        <Story />
      </Box>
    ),
  ],
};
