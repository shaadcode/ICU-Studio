import { isString } from 'es-toolkit';
import { useForm } from '@mantine/form';
import { useRef, useEffect } from 'react';
import { useTranslations } from 'use-intl';
import { useDebouncedCallback } from '@mantine/hooks';
import { Group, Accordion, TextInput } from '@mantine/core';

import VariableName from '../../VariableName/VariableName';
import VariableType from '../../VariableType/VariableType';
import { icuEditorStore } from '@/pages/landing/config/store';
import type { ICUEditorStore } from '@/pages/landing/config/store';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';
import { TEST_VARIABLES_ACCORDION_TRANSITION_DURATION } from '@/shared/lib/mantine';

type Props = {
  data: ICUEditorStore['variables'][number];
};

const TestSimpleVariableField = (props: Props) => {
  const variable = props.data;
  const inputRef = useRef<HTMLInputElement>(null);
  const value = isString(variable.value) ? variable.value : 'unknown';
  const t = useTranslations('editor.messageFormatEnum');
  const tCommon = useTranslations('common');
  const updateVariableInitialValue = icuEditorStore.use.actions().updateVariableInitialValue;

  const handleSetVariableValue = useDebouncedCallback((fieldValue: string) => {
    updateVariableInitialValue(variable.name, fieldValue);
  }, BOUNCE_UPDATE_VARIABLE_VALUE);

  const form = useForm({
    initialValues: { variable: value ?? '' },
    onValuesChange: ({ variable }) => handleSetVariableValue(variable),
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Accordion.Item
      value={`${variable.name}-${variable.enumType}`}
    >
      <Accordion.Control onClick={() => {
        setTimeout(() => {
          inputRef.current?.select();
        }, TEST_VARIABLES_ACCORDION_TRANSITION_DURATION);
      }}
      >
        <Group>
          <VariableName value={variable.name} />
          {/* @ts-expect-error */}
          <VariableType value={t(String(variable.enumType))} />
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <TextInput
          ref={inputRef}
          key={form.key('variable')}
          placeholder={tCommon('value')}
          {...form.getInputProps('variable')}
        />
      </Accordion.Panel>
    </Accordion.Item>

  );
};

export default TestSimpleVariableField;
