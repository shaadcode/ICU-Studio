import dayjs from 'dayjs';
import { isDate } from 'es-toolkit';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { isObject } from 'es-toolkit/compat';
import { DateTimePicker } from '@mantine/dates';
import { useDebouncedCallback } from '@mantine/hooks';
import { Group, Tooltip, Accordion } from '@mantine/core';
import type { TimeElement } from '@formatjs/icu-messageformat-parser';

import InfoBadge from '../../InfoBadge/InfoBadge';
import VariableName from '../../VariableName/VariableName';
import VariableType from '../../VariableType/VariableType';
import { icuEditorStore } from '@/pages/landing/config/store';
import type { ICUEditorStore } from '@/pages/landing/config/store';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';

type Props = {
  data: ICUEditorStore['variables'][number];
};

const TestTimeField = (props: Props) => {
  const variable = props.data;
  const value = isDate(variable.value) ? variable.value : new Date();
  const t = useTranslations('editor');
  const tCommon = useTranslations('common');
  const updateVariableInitialValue = icuEditorStore.use.actions().updateVariableInitialValue;
  const handleSetVariableValue = useDebouncedCallback((fieldValue: Date) => {
    updateVariableInitialValue(
      variable.name,
      fieldValue,
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
          <TimeSkeletons style={variable.config?.timeStyle} />
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Group>
          <DateTimePicker
            value={value}
            placeholder={tCommon('dateAndTime')}
            valueFormat={date => dayjs(date).format('dddd, MMMM D [at] h:mm A')}

            onChange={date => date && form.setFieldValue('variable', new Date(date))}
          />
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default TestTimeField;

function TimeSkeletons({ style }: { style: TimeElement['style'] }) {
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
