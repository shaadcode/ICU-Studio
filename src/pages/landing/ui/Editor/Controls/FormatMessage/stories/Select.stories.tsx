import type { Meta, StoryObj } from '@storybook/react-vite';

import FormatMessageControl from '../FormatMessage';
import { createSimpleFormatMessageTest, createSimpleFormatMessageDecorator } from './shared';

const meta = {
  component: FormatMessageControl,
  title: 'Editor/FormatMessage/select',
} satisfies Meta<typeof FormatMessageControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SimpleSelect: Story = {
  play: createSimpleFormatMessageTest(`{gender,select,
    male{He}
    female{She}
    other{They}
}`),
  decorators: [createSimpleFormatMessageDecorator(`{gender, select,
  male{He}
  female{She}
  other{They}
}`)],
};

export const SelectInText: Story = {
  play: createSimpleFormatMessageTest(`{gender,select,
    male{He}
    female{She}
    other{They}
} updated their profile.`),
  decorators: [createSimpleFormatMessageDecorator(`{gender, select,
  male {He}
  female {She}
  other {They}
} updated their profile.`)],
};

export const SelectWithSimpleVariable: Story = {
  play: createSimpleFormatMessageTest(`{name} changed {gender,select,
    male{his}
    female{her}
    other{their}
} password`),
  decorators: [createSimpleFormatMessageDecorator(`{name} changed {gender, select,
  male {his}
  female {her}
  other {their}
} password`)],
};

export const Multiple: Story = {
  play: createSimpleFormatMessageTest(`{gender,select,
    male{He}
    female{She}
    other{They}
} and {gender,select,
    male{He}
    female{She}
    other{They}
}`),
  decorators: [createSimpleFormatMessageDecorator(`{gender,select,
    male{He}
    female{She}
    other{They}
} and {gender,select,
    male{He}
    female{She}
    other{They}
}`)],
};
