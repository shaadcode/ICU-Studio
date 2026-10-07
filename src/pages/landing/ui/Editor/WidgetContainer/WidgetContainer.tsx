import { Paper } from '@mantine/core';

import classes from './WidgetContainer.module.css';

const WidgetContainer = Paper.withProps({
  w: 400,
  p: 'xs',
  h: '100%',
  shadow: 'xs',
  classNames: {
    root: classes['widget-container'],
  },
});

export default WidgetContainer;
