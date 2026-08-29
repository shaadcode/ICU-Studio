import React from 'react';
import { Badge } from '@mantine/core';

import classes from './VariableName.module.css';

type Props = {
  value: string;
};

const VariableName = (props: Props) => {
  return (
    <Badge
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

export default VariableName;
