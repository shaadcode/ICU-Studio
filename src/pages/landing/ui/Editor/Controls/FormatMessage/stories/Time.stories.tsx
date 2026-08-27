import type { Meta, StoryObj } from '@storybook/react-vite';

import FormatMessageControl from '../FormatMessage';
import { createSimpleFormatMessageTest, createSimpleFormatMessageDecorator } from './shared';

const meta = {
  component: FormatMessageControl,
  title: 'Editor/FormatMessage/time',
} satisfies Meta<typeof FormatMessageControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  play: createSimpleFormatMessageTest(`Time: {time,time,short}`),
  decorators: [createSimpleFormatMessageDecorator(`Time: {time, time, short}`)],
};

export const WithFormatter: Story = {
  play: createSimpleFormatMessageTest(`Time: {time,time,::Hm}`),
  decorators: [createSimpleFormatMessageDecorator(`Time: {time, time, ::Hm}`)],
};
