import { isString } from 'es-toolkit';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { useDebouncedCallback } from '@mantine/hooks';
import { Text, Group, Stack, Scroller, SegmentedControl } from '@mantine/core';

import classes from './TestSelectField.module.css';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import type { ICUEditorStore } from '@/pages/landing/config/store/editor';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';

type Props = {
  data: ICUEditorStore['variables'][number];
};

const TestSelectField = (props: Props) => {
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
    onValuesChange: ({ variable: v }) => handleSetVariableValue(v),
  });

  const conditions = (variable.config?.conditions as string[]) ?? [];

  return (
    <Group gap="md" wrap="nowrap" align="center">
      <Stack gap={2} style={{ minWidth: 100, flexShrink: 0 }}>
        <Group gap={4} align="center">
          <Text fw={600} size="sm" c="grape.6">
            {variable.name}
          </Text>
        </Group>
        <Text size="xs" c="dimmed" tt="capitalize">
          {/* @ts-expect-error */}
          {t(String(variable.enumType))}
        </Text>
      </Stack>

      <Scroller mis="auto" maw="200px" controlSize={0}>
        <SegmentedControl
          w="100%"
          size="xs"
          data={conditions}
          classNames={{ innerLabel: classes['presetLabel'] }}
          {...form.getInputProps('variable')}
        />
      </Scroller>
    </Group>
  );
};

export default TestSelectField;
