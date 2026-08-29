import type { Meta, StoryObj } from '@storybook/react-vite';

import FormatMessageControl from '../FormatMessage';
import { createSimpleFormatMessageTest, createSimpleFormatMessageDecorator } from './shared';

const meta = {
  component: FormatMessageControl,
  title: 'Editor/Controls/FormatMessage/date',
} satisfies Meta<typeof FormatMessageControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  play: createSimpleFormatMessageTest(`{date,date,medium}`),
  decorators: [createSimpleFormatMessageDecorator(`{date, date, medium}`)],
};
export const InText: Story = {
  play: createSimpleFormatMessageTest(`Date: {date,date,short}`),
  decorators: [createSimpleFormatMessageDecorator(`Date: {date, date, short}`)],
};

export const WithTime: Story = {
  play: createSimpleFormatMessageTest(`Scheduled for {date,date,medium} at {date,time,short}`),
  decorators: [createSimpleFormatMessageDecorator(`Scheduled for {date, date, medium} at {date, time, short}`)],
};

export const WithTimeAndSimpleVariable: Story = {
  play: createSimpleFormatMessageTest(`{event} on {date,date,full} from {start,time,short} to {end,time,short}`),
  decorators: [createSimpleFormatMessageDecorator(`{event} on {date, date, full} from {start, time, short} to {end, time, short}`)],
};

export const Multiple: Story = {
  play: createSimpleFormatMessageTest(`{date,date,medium}{date,date,full}`),
  decorators: [createSimpleFormatMessageDecorator(`{date, date, medium}{date, date, full}`)],
};

export const WithSkeleton: Story = {
  play: createSimpleFormatMessageTest(`Published: {date,date,::yMMMd}`),
  decorators: [createSimpleFormatMessageDecorator(`Published: {date, date, ::yMMMd}`)],
};
