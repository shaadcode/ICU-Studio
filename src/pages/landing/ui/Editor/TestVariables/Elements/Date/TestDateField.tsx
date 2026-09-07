import { isDate } from 'es-toolkit';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { DateInput } from '@mantine/dates';
import { isObject } from 'es-toolkit/compat';
import { useDebouncedCallback } from '@mantine/hooks';
import type { DateElement } from '@formatjs/icu-messageformat-parser';
import { Group, Tooltip, Scroller, Accordion, SegmentedControl } from '@mantine/core';

import classes from './TestDateField.module.css';
import InfoBadge from '../../InfoBadge/InfoBadge';
import VariableName from '../../VariableName/VariableName';
import VariableType from '../../VariableType/VariableType';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import type { ICUEditorStore } from '@/pages/landing/config/store/editor';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';

type Props = {
  data: ICUEditorStore['variables'][number];
};

const dates = (() => {
  const date = new Date();

  return {
    today: new Date(new Date().setDate(date.getDate())),
    lastWeek: new Date(new Date().setDate(date.getDate() - 7)),
    tomorrow: new Date(new Date().setDate(date.getDate() + 1)),
    nextWeek: new Date(new Date().setDate(date.getDate() + 7)),
    yesterDay: new Date(new Date().setDate(date.getDate() - 1)),
    lastYear: new Date(new Date().setDate(date.getDate() - 365)),
    nextYear: new Date(new Date().setDate(date.getDate() + 365)),
  };
})();

const TestDateField = (props: Props) => {
  const variable = props.data;
  const value = isDate(variable.value) ? variable.value : new Date();
  const t = useTranslations('editor');
  const tCommon = useTranslations('common');

  const updateVariableInitialValue = icuEditorStore.use.actions().updateVariableInitialValue;
  const handleSetVariableValue = useDebouncedCallback((fieldValue: Date | keyof typeof dates) => {
    updateVariableInitialValue(
      variable.name,
      isDate(fieldValue) ? fieldValue : dates[fieldValue],
    );
  }, BOUNCE_UPDATE_VARIABLE_VALUE);

  const form = useForm({
    initialValues: { variable: value },
    onValuesChange: ({ variable }) => handleSetVariableValue(variable),
  });

  return (
    <Accordion.Item value={`${variable.name}-${variable.enumType}`}>
      <Accordion.Control>
        <Group>
          <VariableName value={variable.name} />
          {/* @ts-expect-error */}
          <VariableType value={t(`messageFormatEnum.${String(variable.enumType)}`)} />

          <DateSkeletons style={variable.config?.dateStyle} />
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Group>
          <Scroller controlSize={0}>
            <SegmentedControl
              classNames={{ innerLabel: classes['presetLabel'] }}
              data={[
                { value: 'lastYear', label: t('lastYear') },
                { value: 'lastWeek', label: t('lastWeek') },
                { value: 'yesterDay', label: t('yesterday') },
                { value: 'today', label: t('today') },
                { value: 'tomorrow', label: t('tomorrow') },
                { value: 'nextWeek', label: t('nextWeek') },
                { value: 'nextYear', label: t('nextYear') },
              ]}
              {...form.getInputProps('variable')}
            />
          </Scroller>
          <DateInput
            value={value}
            placeholder={tCommon('date')}

            onChange={date => date && form.setFieldValue('variable', new Date(date))}
          />
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default TestDateField;

function DateSkeletons({ style }: { style: DateElement['style'] }) {
  const t = useTranslations('editor');

  if (!style) {
    return <></>;
  }
  if (isObject(style)) {
    return (
      <>
        <Tooltip label={t('format')}>
          <InfoBadge color="blue" variant="outline">
            {style.pattern}
          </InfoBadge>
        </Tooltip>

        {Object.entries(style.parsedOptions).map(([option, value]) => (
          <InfoBadge key={option} color="blue" variant="outline">
            {option}
            {': '}
            {value}
          </InfoBadge>
        ))}
      </>
    );
  }

  return (
    <Tooltip label={t('format')}>
      <InfoBadge key={style} color="blue" variant="outline">
        {style}
      </InfoBadge>
    </Tooltip>
  );
}
