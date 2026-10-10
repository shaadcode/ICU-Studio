import { Paper } from '@mantine/core';

import classes from './WidgetContainer.module.css';

const WidgetContainer = Paper.withProps({
  classNames: {
    root: classes['widget-container'],
  },
});

export default WidgetContainer;
