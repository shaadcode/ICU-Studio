import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { isNumber, isString } from 'es-toolkit';
import { useDebouncedCallback } from '@mantine/hooks';
import { Group, Badge, Accordion, NumberInput, SegmentedControl } from '@mantine/core';

import classes from './TestPluralField.module.css';
import VariableName from '../../VariableName/VariableName';
import VariableType from '../../VariableType/VariableType';
import { icuEditorStore } from '@/pages/landing/config/store';
import type { ICUEditorStore } from '@/pages/landing/config/store';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';

type Props = {
  data: ICUEditorStore['variables'][number];
};

const TestPluralField = (props: Props) => {
  const variable = props.data;
  const value = isString(variable.value)
    ? variable.value
    : isNumber(variable.value)
      ? String(variable.value)
      : 'unknown';
  const t = useTranslations('editor');
  const tCommon = useTranslations('common');
  const updateVariableInitialValue = icuEditorStore.use.actions().updateVariableInitialValue;
  const handleSetVariableValue = useDebouncedCallback((fieldValue: string) => {
    updateVariableInitialValue(variable.name, fieldValue);
  }, BOUNCE_UPDATE_VARIABLE_VALUE);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { variable: value ?? '' },
    onValuesChange: ({ variable }) => handleSetVariableValue(variable),
  });

  return (
    <Accordion.Item value={`${variable.name}-${variable.enumType}`}>
      <Accordion.Control>
        <Group gap="sm">
          <VariableName value={variable.name} />
          {/* @ts-expect-error */}
          <VariableType value={t(`messageFormatEnum.${String(variable.enumType)}`)} />
          <Badge
            color="orange"
            variant="light"
            classNames={{
              root: classes['badgeRoot'],
              label: classes['badgeLabel'],
            }}
          >
            {t('offset')}
            {': '}
            {variable.config?.offset ?? 'unknown'}
          </Badge>
          <Badge
            color="blue"
            variant="light"
            classNames={{
              root: classes['badgeRoot'],
              label: classes['badgeLabel'],
            }}
          >
            {t('pluralType')}
            {': '}
            {variable.config?.pluralType ?? 'unknown'}
          </Badge>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Group>
          <SegmentedControl
            data={[0, 1, 2, 5, 10, 100]}
            {...form.getInputProps('variable')}
          />
          <NumberInput
            w={75}
            placeholder={tCommon('number')}
            styles={{ input: { height: '41px' } }}
            {...form.getInputProps('variable')}
          />
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default TestPluralField;
