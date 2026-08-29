import React from 'react';
import { Badge } from '@mantine/core';

import classes from './VariableType.module.css';

type Props = {
  value: string;
};

const VariableType = (props: Props) => {
  return (
    <Badge
      color="green"
      variant="light"
      classNames={{
        root: classes['badgeRoot'],
        label: classes['badgeLabel'],
      }}
    >
      {props.value}
    </Badge>

  );
};

export default VariableType;
