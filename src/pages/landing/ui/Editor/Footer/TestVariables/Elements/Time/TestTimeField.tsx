import dayjs from 'dayjs';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { TimePicker } from '@mantine/dates';
import { isDate, capitalize } from 'es-toolkit';
import { IconClock } from '@tabler/icons-react';
import { Text, Group, Stack } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';

import { icuEditorStore } from '@/pages/landing/config/store/editor';
import type { ICUEditorStore } from '@/pages/landing/config/store/editor';
import { BOUNCE_UPDATE_VARIABLE_VALUE } from '@/shared/lib/icu/constants';

type Props = {
  data: ICUEditorStore['variables'][number];
};

const TIME_FORMAT = 'HH:mm';

const TestTimeField = (props: Props) => {
  const variable = props.data;
  const value = isDate(variable.value) ? variable.value : new Date();
  const t = useTranslations('editor');
  const tCommon = useTranslations('common');

  const updateVariableInitialValue = icuEditorStore.use.actions().updateVariableInitialValue;
  const handleSetVariableValue = useDebouncedCallback((fieldValue: Date) => {
    updateVariableInitialValue(variable.name, fieldValue);
  }, BOUNCE_UPDATE_VARIABLE_VALUE);

  const form = useForm({
    initialValues: { variable: value },
    onValuesChange: ({ variable: v }) => handleSetVariableValue(v),
  });

  const formattedTime = dayjs(form.values.variable).format(TIME_FORMAT);

  const presets = [
    {
      label: capitalize(tCommon('morning')),
      values: ['06:00:00', '08:00:00', '10:00:00'],
    },
    {
      label: capitalize(tCommon('afternoon')),
      values: ['12:00:00', '14:00:00', '16:00:00'],
    },
    {
      label: capitalize(tCommon('evening')),
      values: ['18:00:00', '20:00:00', '22:00:00'],
    },
  ];

  return (
    <Group gap="md" wrap="nowrap" align="center">
      <Stack gap={2} style={{ minWidth: 100, flexShrink: 0 }}>
        <Group gap={4} align="center">
          <Text fw={600} size="sm" c="blue.6">
            {variable.name}
          </Text>
        </Group>
        <Text size="xs" c="dimmed" tt="capitalize">
          {/* @ts-expect-error */}
          {t(`messageFormatEnum.${String(variable.enumType)}`)}
        </Text>
      </Stack>

      <TimePicker
        w="100%"
        size="xs"
        withDropdown
        presets={presets}
        value={formattedTime}
        leftSection={<IconClock size={14} />}

        onChange={(input) => {
          if (!input) {
            return;
          }

          const [hours, minutes] = input.split(':');
          if (!hours || !minutes) {
            return;
          }

          const next = new Date(form.values.variable);
          next.setHours(Number(hours), Number(minutes), 0, 0);

          form.setFieldValue('variable', next);
        }}
      />
    </Group>
  );
};

export default TestTimeField;
