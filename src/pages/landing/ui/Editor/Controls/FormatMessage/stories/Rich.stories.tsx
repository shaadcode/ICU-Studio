import type { Meta, StoryObj } from '@storybook/react-vite';

import FormatMessageControl from '../FormatMessage';
import { createSimpleFormatMessageTest, createSimpleFormatMessageDecorator } from './shared';

const meta = {
  component: FormatMessageControl,
  title: 'Editor/Controls/FormatMessage/rich',
} satisfies Meta<typeof FormatMessageControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  play: createSimpleFormatMessageTest(`<link>rich tag</link>`),
  decorators: [createSimpleFormatMessageDecorator(`<link>rich tag</link>`, { withSetContent: true })],
};

export const inText: Story = {
  play: createSimpleFormatMessageTest(`text <rich>rich tag</rich>`),
  decorators: [createSimpleFormatMessageDecorator(`text <rich>rich tag</rich>`, { withSetContent: true })],
};

export const Multiple: Story = {
  play: createSimpleFormatMessageTest(`<icon>info</icon> Updated by <user>{name}</user> on <time>{date,date,medium}</time>`),
  decorators: [createSimpleFormatMessageDecorator(`<icon>info</icon> Updated by <user>{name}</user> on <time>{date, date, medium}</time>`, { withSetContent: true })],
};

export const HTMLTag: Story = {
  play: createSimpleFormatMessageTest(`This is <b>very important</b> information`),
  decorators: [createSimpleFormatMessageDecorator(`This is <b>very important</b> information`, { withSetContent: true })],
};

export const NestingHTMLTag: Story = {
  play: createSimpleFormatMessageTest(`Click <b><link>here</link></b> to download`),
  decorators: [createSimpleFormatMessageDecorator(`Click <b><link>here</link></b> to download`, { withSetContent: true })],
};

export const SimpleVariableInTag: Story = {
  play: createSimpleFormatMessageTest(`Search results for <highlight>{query}</highlight>`),
  decorators: [createSimpleFormatMessageDecorator(`Search results for <highlight>{query}</highlight>`, { withSetContent: true })],
};

export const PluralInTag: Story = {
  play: createSimpleFormatMessageTest(`You have <b>{count,plural,
    =0{no items}
    one{1 item}
    other{# items}
}</b> in your cart`),
  decorators: [createSimpleFormatMessageDecorator(`You have <b>{count, plural,
  =0 {no items}
  one {1 item}
  other {# items}
}</b> in your cart`, { withSetContent: true })],
};

export const SelectInTag: Story = {
  play: createSimpleFormatMessageTest(`Status: <badge>{status,select,
    active{Active}
    paused{Paused}
    expired{Expired}
    other{Unknown}
}</badge>`),
  decorators: [createSimpleFormatMessageDecorator(`Status: <badge>{status, select,
  active {Active}
  paused {Paused}
  expired {Expired}
  other {Unknown}
}</badge>`, { withSetContent: true })],
};

export const NumberInTag: Story = {
  play: createSimpleFormatMessageTest(`Total: <b>{amount,number,::currency/USD}</b> (includes tax)`),
  decorators: [createSimpleFormatMessageDecorator(`Total: <b>{amount, number, ::currency/USD}</b> (includes tax)`, { withSetContent: true })],
};

export const DateInTag: Story = {
  play: createSimpleFormatMessageTest(`Due: <b>{date,date,long}</b>. <link>Set reminder</link>`),
  decorators: [createSimpleFormatMessageDecorator(`Due: <b>{date, date, long}</b>. <link>Set reminder</link>`, { withSetContent: true })],
};

export const TimeInTag: Story = {
  play: createSimpleFormatMessageTest(`Due: <b>{time,time,long}</b>. <link>Set reminder</link>`),
  decorators: [createSimpleFormatMessageDecorator(`Due: <b>{time, time, long}</b>. <link>Set reminder</link>`, { withSetContent: true })],
};
