import type { Meta, StoryObj } from '@storybook/react-vite';

import FormatMessageControl from '../FormatMessage';
import { createSimpleFormatMessageTest, createSimpleFormatMessageDecorator } from './shared';

const meta = {
  component: FormatMessageControl,
  title: 'Editor/Controls/FormatMessage/number',
} satisfies Meta<typeof FormatMessageControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  play: createSimpleFormatMessageTest(`Total: {value,number}`),
  decorators: [createSimpleFormatMessageDecorator(`Total: {value, number}`)],
};

export const WithFormatter: Story = {
  play: createSimpleFormatMessageTest(`Rating: {rating,number,::.0}`),
  decorators: [createSimpleFormatMessageDecorator(`Rating: {rating,number, ::.0}`)],
};

export const MultipleWithText: Story = {
  play: createSimpleFormatMessageTest(`{size,number,::compact-short}B used of {total,number,::compact-short}B`),
  decorators: [createSimpleFormatMessageDecorator(`{size, number, ::compact-short}B used of {total, number, ::compact-short}B`)],
};
export const Multiple: Story = {
  play: createSimpleFormatMessageTest(`{size,number,::compact-short}{total,number,::compact-short}B`),
  decorators: [createSimpleFormatMessageDecorator(`{size, number, ::compact-short}{total, number, ::compact-short}B`)],
};

export const MultipleFormatter: Story = {
  play: createSimpleFormatMessageTest(`Revenue: {amount,number,::compact-short currency/USD}`),
  decorators: [createSimpleFormatMessageDecorator(`Revenue: {amount, number, ::compact-short currency/USD}`)],
};

export const NonDecimal: Story = {
  play: createSimpleFormatMessageTest(`{count,number,integer} items processed`),
  decorators: [createSimpleFormatMessageDecorator(`{count, number, integer} items processed`)],
};
