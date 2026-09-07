import { useRef } from 'react';
import { isNumber } from 'es-toolkit';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { isObject } from 'es-toolkit/compat';
import { useDebouncedCallback } from '@mantine/hooks';
import { Group, Tooltip, Accordion, NumberInput } from '@mantine/core';
import type { NumberElement } from '@formatjs/icu-messageformat-parser';

import InfoBadge from '../../InfoBadge/InfoBadge';
import VariableName from '../../VariableName/VariableName';
import VariableType from '../../VariableType/VariableType';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';
import type { ICUEditorStore } from '@/pages/landing/config/store/editor';
import { TEST_VARIABLES_ACCORDION_TRANSITION_DURATION } from '@/shared/lib/mantine';

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
    onValuesChange: ({ variable }) => handleSetVariableValue(variable),
    enhanceGetInputProps: () => ({ onFocus: () => inputRef.current?.select() }),
  });

  return (
    <Accordion.Item value={`${variable.name}-${variable.enumType}`}>
      <Accordion.Control onClick={() => {
        setTimeout(() => {
          inputRef.current?.select();
        }, TEST_VARIABLES_ACCORDION_TRANSITION_DURATION);
      }}
      >
        <Group>
          <VariableName value={variable.name} />
          {/* @ts-expect-error */}
          <VariableType value={t(`messageFormatEnum.${String(variable.enumType)}`)} />
          <NumberSkeletons style={variable.config?.numberStyle} />
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Group>
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
