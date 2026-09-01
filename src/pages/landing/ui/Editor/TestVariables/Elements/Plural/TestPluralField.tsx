import { useRef } from 'react';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { isNumber, isString } from 'es-toolkit';
import { useDebouncedCallback } from '@mantine/hooks';
import { Group, Accordion, NumberInput, SegmentedControl } from '@mantine/core';

import InfoBadge from '../../InfoBadge/InfoBadge';
import classes from './TestPluralField.module.css';
import VariableName from '../../VariableName/VariableName';
import VariableType from '../../VariableType/VariableType';
import { icuEditorStore } from '@/pages/landing/config/store';
import type { ICUEditorStore } from '@/pages/landing/config/store';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';
import { TEST_VARIABLES_ACCORDION_TRANSITION_DURATION } from '@/shared/lib/mantine';

type Props = {
  data: ICUEditorStore['variables'][number];
};

const TestPluralField = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
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
    mode: 'controlled',
    initialValues: { variable: value ?? '' },
    onValuesChange: ({ variable }) => handleSetVariableValue(variable),
    enhanceGetInputProps: () => ({ onFocus: () => inputRef.current?.select }),
  });

  return (
    <Accordion.Item value={`${variable.name}-${variable.enumType}`}>
      <Accordion.Control onClick={() => {
        setTimeout(() => {
          inputRef.current?.select();
        }, TEST_VARIABLES_ACCORDION_TRANSITION_DURATION);
      }}
      >
        <Group gap="sm">
          <VariableName value={variable.name} />
          {/* @ts-expect-error */}
          <VariableType value={t(`messageFormatEnum.${String(variable.enumType)}`)} />
          <InfoBadge color="orange">
            {t('offset')}
            {': '}
            {variable.config?.offset ?? 'unknown'}
          </InfoBadge>

          <InfoBadge color="blue">
            {t('pluralType')}
            {': '}
            {variable.config?.pluralType ?? 'unknown'}
          </InfoBadge>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Group>
          <SegmentedControl
            data={[0, 1, 2, 5, 10, 100]}
            classNames={{ innerLabel: classes['presetLabel'] }}
            {...form.getInputProps('variable')}
          />
          <NumberInput
            w={75}
            ref={inputRef}
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
