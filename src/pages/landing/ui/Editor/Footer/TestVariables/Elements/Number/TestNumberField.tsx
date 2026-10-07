import { useRef } from 'react';
import { isNumber } from 'es-toolkit';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { isObject } from 'es-toolkit/compat';
import { useDebouncedCallback } from '@mantine/hooks';
import type { NumberElement } from '@formatjs/icu-messageformat-parser';
import {
  Text,
  Group,
  Stack,
  Tooltip,
  NumberInput,
} from '@mantine/core';

import InfoBadge from '../../InfoBadge/InfoBadge';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';
import type { ICUEditorStore } from '@/pages/landing/config/store/editor';

type Props = {
  data: ICUEditorStore['variables'][number];
};

const TestNumberField = (props: Props) => {
  const variable = props.data;
  const value = isNumber(variable.value) ? variable.value : -1;
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('editor');
  const tCommon = useTranslations('common');
  const updateVariableInitialValue = icuEditorStore.use.actions().updateVariableInitialValue;

  const handleSetVariableValue = useDebouncedCallback((fieldValue: number) => {
    updateVariableInitialValue(variable.name, fieldValue);
  }, BOUNCE_UPDATE_VARIABLE_VALUE);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { variable: value },
    onValuesChange: ({ variable: v }) => handleSetVariableValue(v),
    enhanceGetInputProps: () => ({ onFocus: () => inputRef.current?.select() }),
  });

  return (
    <Group gap="md" wrap="nowrap" align="center">
      <Stack gap={2} style={{ minWidth: 100, flexShrink: 0 }}>
        <Group gap={4} align="center">
          <Text fw={600} size="sm" c="blue.6">
            {variable.name}
          </Text>
          <NumberSkeletons style={variable.config?.numberStyle} />
        </Group>
        <Text size="xs" c="dimmed" tt="capitalize">
          {/* @ts-expect-error */}
          {t(`messageFormatEnum.${String(variable.enumType)}`)}
        </Text>
      </Stack>

      <NumberInput
        w="100%"
        ref={inputRef}
        placeholder={tCommon('number')}
        rightSectionPointerEvents="all"

        {...form.getInputProps('variable')}
      />
    </Group>
  );
};

export default TestNumberField;

function NumberSkeletons({ style }: { style: NumberElement['style'] }) {
  const t = useTranslations('editor');

  if (!style) {
    return <></>;
  }

  if (isObject(style)) {
    const badges = style.tokens.map(token => (
      <Tooltip key={token.stem} label={t('format')}>
        <InfoBadge color="blue" variant="outline">
          {token.stem}
          {!!token.options.length && ': '}
          {token
            .options
            .map(opt => `${opt}`)}
        </InfoBadge>
      </Tooltip>
    ));
    return badges;
  }

  return (
    <Tooltip label={t('format')}>
      <InfoBadge key={style} color="blue" variant="outline">
        {style}
      </InfoBadge>
    </Tooltip>
  );
}
