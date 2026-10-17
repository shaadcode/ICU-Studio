import type { MantineThemeComponents } from '@mantine/core';
import { Loader, MenuItem, ActionIcon } from '@mantine/core';

import actionIconClasses from './ActionIcon.module.css';

export const components = {
  Loader: Loader.extend({
    defaultProps: { type: 'bars' },
  }),
  MenuItem: MenuItem.extend({
    defaultProps: {
      fz: 'xs',
      tt: 'capitalize',
    },
  }),
  ActionIcon: ActionIcon.extend({
    classNames: actionIconClasses,
    defaultProps: { radius: 12, size: 'lg', bd: 'none' },
  }),
} as const satisfies MantineThemeComponents;
