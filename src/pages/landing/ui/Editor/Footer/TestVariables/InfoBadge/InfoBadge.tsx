import { Badge } from '@mantine/core';
import type { ComponentProps } from 'react';

import classes from './InfoBadge.module.css';

type Params = ComponentProps<typeof Badge<'div'>>;
const InfoBadge = (params: Params) => {
  return (
    <Badge
      variant="light"
      classNames={{
        root: classes['badgeRoot'],
        label: classes['badgeLabel'],
      }}
      {...params}
    />
  );
};

export default InfoBadge;
