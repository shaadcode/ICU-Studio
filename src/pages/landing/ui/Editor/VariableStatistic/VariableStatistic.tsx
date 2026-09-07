import { useTranslations } from 'use-intl';
import { Group, RollingNumber } from '@mantine/core';

import classes from './VariableStatistic.module.css';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import type { MessageElementsTypeKeyword } from '@/shared/lib/icu/types';

const VariableStatistic = () => {
  const t = useTranslations('editor');
  const variables = icuEditorStore.use.variables();
  const statistic = variables.reduce((prevAcc, variable) => {
    const prevAmountVariable = prevAcc[variable.keywordType] ?? 0;
    return { ...prevAcc, [variable.keywordType]: prevAmountVariable + 1 };
  }, {} as Record<MessageElementsTypeKeyword, number>);
  const items = Object.entries(statistic).map(([variableName, amount]) => (
    <RollingNumber
      value={amount}
      key={variableName}
      mod={{ 'data-variable-type': variableName }}
      prefix={`${t(`messageFormatEnumKeyword.${variableName}` as any)}: `}
      classNames={{
        char: classes['rollingNumberChar'],
        root: classes['rollingNumberRoot'],
      }}
    />
  ));

  return (
    <Group gap="xs">
      {items}
    </Group>
  );
};

export default VariableStatistic;
