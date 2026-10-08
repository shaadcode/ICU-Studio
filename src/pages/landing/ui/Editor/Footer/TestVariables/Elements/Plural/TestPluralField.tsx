import { useRef } from 'react';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { isNumber, isString } from 'es-toolkit';
import { useDebouncedCallback } from '@mantine/hooks';
import { Text, Group, Stack, NumberInput } from '@mantine/core';

import { icuEditorStore } from '@/pages/landing/config/store/editor';
import type { ICUEditorStore } from '@/pages/landing/config/store/editor';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';

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
      : '';

  const t = useTranslations('editor');
  const tCommon = useTranslations('common');
  const updateVariableInitialValue = icuEditorStore.use.actions().updateVariableInitialValue;

  const handleSetVariableValue = useDebouncedCallback((fieldValue: string) => {
    updateVariableInitialValue(variable.name, fieldValue);
  }, BOUNCE_UPDATE_VARIABLE_VALUE);

  const form = useForm({
    mode: 'controlled',
    initialValues: { variable: value ?? '' },
    onValuesChange: ({ variable: v }) => handleSetVariableValue(v),
    enhanceGetInputProps: () => ({
      onFocus: () => inputRef.current?.select(),
    }),
  });

  return (
    <Group gap="md" wrap="nowrap" align="center">
      <Stack gap={2} style={{ minWidth: 100, flexShrink: 0 }}>
        <Group gap={4} align="center">
          <Text fw={600} size="sm" c="orange.6">
            {variable.name}
          </Text>
        </Group>
        <Text size="xs" c="dimmed" tt="capitalize">
          {/* @ts-expect-error */}
          {t(`messageFormatEnum.${String(variable.enumType)}`)}
        </Text>
      </Stack>

      <Group gap="xs" wrap="nowrap" align="center" style={{ flex: 1, minWidth: 0 }}>
        {/* <InfoBadge color="orange">
          {t('offset')}
          {': '}
          {variable.config?.offset ?? 'unknown'}
        </InfoBadge>

        <InfoBadge color="blue">
          {t('pluralType')}
          {': '}
          {variable.config?.pluralType ?? 'unknown'}
        </InfoBadge> */}

        <NumberInput
          w="100%"
          size="xs"
          ref={inputRef}
          placeholder={tCommon('number')}
          {...form.getInputProps('variable')}
        />
      </Group>
    </Group>
  );
};

export default TestPluralField;
