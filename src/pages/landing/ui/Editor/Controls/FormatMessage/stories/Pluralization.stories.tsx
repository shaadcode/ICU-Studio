import type { Meta, StoryObj } from '@storybook/react-vite';

import FormatMessageControl from '../FormatMessage';
import { createSimpleFormatMessageTest, createSimpleFormatMessageDecorator } from './shared';

const meta = {
  component: FormatMessageControl,
  title: 'Editor/Controls/FormatMessage/pluralization',
} satisfies Meta<typeof FormatMessageControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SimplePlural: Story = {
  play: createSimpleFormatMessageTest(`{count,plural,
    =0{No items}
    one{1 item}
    other{# items}
}`),
  decorators: [createSimpleFormatMessageDecorator(`{count, plural,
  =0 {No items}
  one {1 item}
  other {# items}
}`)],
};

export const PluralInText: Story = {
  play: createSimpleFormatMessageTest(`some text {count,plural,
    =0{no new messages}
    one{1 new message}
    other{# new messages}
}.`),
  decorators: [createSimpleFormatMessageDecorator(`some text {count, plural,
  =0 {no new messages}
  one {1 new message}
  other {# new messages}
}.`)],
};

export const MultiplePluralInText: Story = {
  play: createSimpleFormatMessageTest(`{fileCount,plural,
    one{1 file}
    other{# files}
} across {folderCount,plural,
    one{1 folder}
    other{# folders}
}`),
  decorators: [createSimpleFormatMessageDecorator(`{fileCount, plural,
  one {1 file}
  other {# files}
} across {folderCount, plural,
  one {1 folder}
  other {# folders}
}`)],
};

export const PluralWithOffset: Story = {
  play: createSimpleFormatMessageTest(`{count,plural,offset:1
    =0{Nobody liked this}
    =1{You liked this}
    one{You and 1 other person liked this}
    other{You and # others liked this}
}`),
  decorators: [createSimpleFormatMessageDecorator(`{count, plural, offset:1
  =0 {Nobody liked this}
  =1 {You liked this}
  one {You and 1 other person liked this}
  other {You and # others liked this}
}`)],
};

export const JustMultiplePlurals: Story = {
  play: createSimpleFormatMessageTest(`{hours,plural,
    =0{}
    one{1 hour }
    other{# hours }
}{minutes,plural,
    =0{}
    one{1 minute}
    other{# minutes}
}`),
  decorators: [createSimpleFormatMessageDecorator(`{hours, plural,
  =0 {}
  one {1 hour }
  other {# hours }
}{minutes, plural,
  =0 {}
  one {1 minute}
  other {# minutes}
}`)],
};

export const OptionsWithPrefix: Story = {
  play: createSimpleFormatMessageTest(`{change,plural,
    =0{No change}
    one{+1 from last week}
    other{+# from last week}
}`),
  decorators: [createSimpleFormatMessageDecorator(`{change,plural,
  =0 {No change}
  one {+1 from last week}
  other {+# from last week}
}`)],
};

export const WithFormatting: Story = {
  play: createSimpleFormatMessageTest(`{amount,plural,
    =0{No revenue}
    one{{amount,number,::currency/USD} in revenue}
    other{{amount,number,::currency/USD} in revenue}
}`),
  decorators: [createSimpleFormatMessageDecorator(`{amount, plural,
  =0 {No revenue}
  one {{amount, number, ::currency/USD} in revenue}
  other {{amount, number, ::currency/USD} in revenue}
}`)],
};
