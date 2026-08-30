import { useTranslations } from 'use-intl';
import { Badge, Tooltip } from '@mantine/core';

import classes from './VariableType.module.css';
import type { MessageElementsTypeKeyword } from '@/shared/lib/icu/types';

const colors = {
  blue: ['number'],
  green: ['argument'],
  red: ['plural', 'select'],
} as Record<string, ReadonlyArray<MessageElementsTypeKeyword>>;

type Props = {
  value: MessageElementsTypeKeyword;
};

const VariableType = (props: Props) => {
  const t = useTranslations('editor');
  const color = Object
    .entries(colors)
    .find(([, value]) => value.includes(props.value))?.[0] ?? 'yellow';

  return (
    <Tooltip label={t('variableType')}>
      <Badge
        color={color}
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

export default VariableType;
