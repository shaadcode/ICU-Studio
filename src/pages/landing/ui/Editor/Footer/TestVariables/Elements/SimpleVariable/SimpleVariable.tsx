import { useRef } from 'react';
import { isString } from 'es-toolkit';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { useDebouncedCallback } from '@mantine/hooks';
import { Text, Group, Stack, TextInput } from '@mantine/core';

import { icuEditorStore } from '@/pages/landing/config/store/editor';
import type { ICUEditorStore } from '@/pages/landing/config/store/editor';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';

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
    onValuesChange: ({ variable: v }) => handleSetVariableValue(v),
  });

  return (
    <Group gap="md" wrap="nowrap" align="center">
      <Stack gap={2} style={{ minWidth: 100, flexShrink: 0 }}>
        <Text fw={600} size="sm" c="green.9">
          {variable.name}
        </Text>
        <Text size="xs" c="dimmed" tt="capitalize">
          {/* @ts-expect-error */}
          {t(String(variable.enumType))}
        </Text>
      </Stack>

      <TextInput
        w="100%"
        ref={inputRef}
        placeholder={tCommon('value')}
        {...form.getInputProps('variable')}
      />
    </Group>
  );
};

export default TestSimpleVariableField;
