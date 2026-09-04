import type { Meta, StoryObj } from '@storybook/react-vite';

import FormatMessage from '../FormatMessage';
import { createSimpleFormatMessageTest, createSimpleFormatMessageDecorator } from './shared';

const meta = {
  component: FormatMessage,
  title: 'Editor/Controls/FormatMessage/simple-variable',
} satisfies Meta<typeof FormatMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SimpleArguments: Story = {
  play: createSimpleFormatMessageTest('Hello, {name}!'),
  decorators: [createSimpleFormatMessageDecorator('Hello, {name}!')],
};

export const MultipleArguments: Story = {
  play: createSimpleFormatMessageTest(`Welcome back, {firstName} {lastName}!`),
  decorators: [
    createSimpleFormatMessageDecorator(`Welcome back, {firstName} {lastName}!`),
  ],
};

export const EscapeBraces: Story = {
  play: createSimpleFormatMessageTest(`Use \'{\' hi \'}\' to display braces in message`),
  decorators: [
    createSimpleFormatMessageDecorator('Use \'{\' hi \'}\' to display braces in message'),
  ],
};

export const EscapeSingleQuote: Story = {
  play: createSimpleFormatMessageTest(`It's a beautiful day!`),
  decorators: [
    createSimpleFormatMessageDecorator(`It''s a beautiful day!`),
  ],
};

export const VariableReuse: Story = {
  play: createSimpleFormatMessageTest(`{name} updated their profile. Welcome back, {name}!`),
  decorators: [
    createSimpleFormatMessageDecorator(`{name} updated their profile. Welcome back, {name}!`),
  ],
};

export const LiteralHashInPlural: Story = {
  play: createSimpleFormatMessageTest(`Item '# {count,plural,
    one{has 1 tag}
    other{has # tags}
    }`),
  decorators: [
    createSimpleFormatMessageDecorator(`Item '# {count, plural, one {has 1 tag} other {has # tags}}`),
  ],
};
