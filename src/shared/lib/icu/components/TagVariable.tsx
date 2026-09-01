import type { ReactNode } from 'react';
import { useTranslations } from 'use-intl';
import { Badge, Tooltip } from '@mantine/core';

import type { VariableInfo } from '../collectVariables';

type Props = {
  children: ReactNode;
  variable: VariableInfo;
};
const TagVariable = ({ children, ...props }: Props) => {
  const t = useTranslations('common');

  return (
    <Tooltip label={`${props.variable.name} ${t('tag')}`}>
      <Badge
        radius="sm"
        color="green"
        tt="capitalize"
        component="span"
        variant="outline"
        styles={{ label: { fontSize: '15px' } }}
      >
        {children}
      </Badge>
    </Tooltip>
  );
};

export default TagVariable;
