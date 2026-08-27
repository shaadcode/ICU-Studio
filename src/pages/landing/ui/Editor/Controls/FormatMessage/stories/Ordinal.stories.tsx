import type { Meta, StoryObj } from '@storybook/react-vite';

import FormatMessageControl from '../FormatMessage';
import { createSimpleFormatMessageTest, createSimpleFormatMessageDecorator } from './shared';

const meta = {
  component: FormatMessageControl,
  title: 'Editor/FormatMessage/ordinal',
} satisfies Meta<typeof FormatMessageControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  play: createSimpleFormatMessageTest(`You finished in {position,selectordinal,
    one{#st}
    two{#nd}
    few{#rd}
    other{#th}
} place!`),
  decorators: [createSimpleFormatMessageDecorator(`You finished in {position, selectordinal,
  one {#st}
  two {#nd}
  few {#rd}
  other {#th}
} place!`)],
};

export const WithSimpleVariable: Story = {
  play: createSimpleFormatMessageTest(`{week,selectordinal,
    one{#st}
    two{#nd}
    few{#rd}
    other{#th}
} week of {month}`),
  decorators: [createSimpleFormatMessageDecorator(`{week, selectordinal,
  one {#st}
  two {#nd}
  few {#rd}
  other {#th}
} week of {month}`)],
};

export const InText: Story = {
  play: createSimpleFormatMessageTest(`{week,selectordinal,
    one{#st}
    two{#nd}
    few{#rd}
    other{#th}
} updated their profile.`),
  decorators: [createSimpleFormatMessageDecorator(`{week, selectordinal,
  one {#st}
  two {#nd}
  few {#rd}
  other {#th}
} updated their profile.`)],
};
