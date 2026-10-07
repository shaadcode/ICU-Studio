import { Loader, ActionIcon } from '@mantine/core';
import type { MantineThemeComponents } from '@mantine/core';

import actionIconClasses from './ActionIcon.module.css';

export const components = {
  Loader: Loader.extend({
    defaultProps: { type: 'bars' },
  }),
  ActionIcon: ActionIcon.extend({
    classNames: actionIconClasses,
    defaultProps: { radius: 12, size: 'lg', bd: 'none' },
  }),
} as const satisfies MantineThemeComponents;
