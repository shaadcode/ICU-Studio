import { useField } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { useDebouncedCallback } from '@mantine/hooks';
import { Group, Accordion, TextInput } from '@mantine/core';

import type { collectVariables } from '@/shared/lib/icu';
import VariableName from '../../VariableName/VariableName';
import VariableType from '../../VariableType/VariableType';
import { icuEditorStore } from '@/pages/landing/config/store';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';

type Props = {
  data: ReturnType<typeof collectVariables>[number];
};

const TestSimpleVariableField = (props: Props) => {
  const [variableName, typeEnum] = props.data;
  const t = useTranslations('editor.messageFormatEnum');
  const tCommon = useTranslations('common');
  const setVariablesValues = icuEditorStore.use.actions().setVariablesValues;
  const handleSetVariableValue = useDebouncedCallback((fieldValue: string) => {
    setVariablesValues(prev => ({ ...prev, [variableName]: fieldValue }));
  }, BOUNCE_UPDATE_VARIABLE_VALUE);

  const field = useField({
    initialValue: '',
    mode: 'uncontrolled',
    onValueChange: handleSetVariableValue,
  });

  return (
    <Accordion.Item value={`${variableName}-${typeEnum}`}>
      <Accordion.Control>
        <Group>
          <VariableName value={variableName} />
          {/* @ts-expect-error */}
          <VariableType value={t(String(typeEnum))} />
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <TextInput placeholder={tCommon('value')} {...field.getInputProps()} />
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default TestSimpleVariableField;
