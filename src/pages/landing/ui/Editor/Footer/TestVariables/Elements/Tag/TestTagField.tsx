import { isString } from 'es-toolkit';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { useDebouncedCallback } from '@mantine/hooks';
import { Group, Accordion, SegmentedControl } from '@mantine/core';

import classes from './TestTagField.module.css';
import VariableName from '../../VariableName/VariableName';
import VariableType from '../../VariableType/VariableType';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import type { ICUEditorStore } from '@/pages/landing/config/store/editor';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';

type Props = {
  data: ICUEditorStore['variables'][number];
};

const TestTagField = (props: Props) => {
  const variable = props.data;
  const value = isString(variable.value) ? variable.value : 'unknown';
  const updateVariableInitialValue = icuEditorStore.use.actions().updateVariableInitialValue;
  const t = useTranslations('editor.messageFormatEnum');
  const handleSetVariableValue = useDebouncedCallback((fieldValue: string) => {
    updateVariableInitialValue(variable.name, fieldValue);
  }, BOUNCE_UPDATE_VARIABLE_VALUE);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      variable: value ?? '',
    },
    onValuesChange: ({ variable }) => handleSetVariableValue(variable),
  });

  return (
    <Accordion.Item value={`${variable.name}-${variable.enumType}`}>
      <Accordion.Control>
        <Group>
          <VariableName value={variable.name} />
          {/* @ts-expect-error */}
          <VariableType value={t(String(variable.enumType))} />
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <SegmentedControl
          classNames={{ innerLabel: classes['presetLabel'] }}
          data={(variable.config?.conditions as string[]) ?? []}
          {...form.getInputProps('variable')}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default TestTagField;
