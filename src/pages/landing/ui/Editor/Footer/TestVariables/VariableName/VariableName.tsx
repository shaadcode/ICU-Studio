import { useTranslations } from 'use-intl';
import { Badge, Tooltip } from '@mantine/core';

import classes from './VariableName.module.css';

type Props = {
  value: string;
};

const VariableName = (props: Props) => {
  const t = useTranslations('editor');

  return (
    <Tooltip label={t('variableName')}>
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
    </Tooltip>
  );
};

export default VariableName;
