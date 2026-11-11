import type { MantineThemeComponents } from '@mantine/core';
import { Modal, Loader, Button, Tooltip, MenuItem, ActionIcon } from '@mantine/core';

import actionIconClasses from './ActionIcon.module.css';

export const components = {
  Tooltip: Tooltip.extend({ defaultProps: { fz: 'xs' } }),
  Button: Button.extend({
    defaultProps: { size: 'xs' },
  }),
  Modal: Modal.extend({
    defaultProps: { centered: true },
  }),
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
