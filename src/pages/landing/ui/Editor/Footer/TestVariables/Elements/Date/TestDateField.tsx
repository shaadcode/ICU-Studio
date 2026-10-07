import { isDate } from 'es-toolkit';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { DateInput } from '@mantine/dates';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconClock, IconCalendar } from '@tabler/icons-react';
import {
  Text,
  Menu,
  Group,
  Stack,
  Button,
} from '@mantine/core';

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

type DatePresetKey = keyof typeof dates;

const TestDateField = (props: Props) => {
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

  const presets: Array<{ label: string; key: DatePresetKey }> = [
    { key: 'lastYear', label: t('lastYear') },
    { key: 'lastWeek', label: t('lastWeek') },
    { key: 'yesterDay', label: t('yesterday') },
    { key: 'today', label: t('today') },
    { key: 'tomorrow', label: t('tomorrow') },
    { key: 'nextWeek', label: t('nextWeek') },
    { key: 'nextYear', label: t('nextYear') },
  ];

  const setPreset = (key: DatePresetKey) => {
    form.setFieldValue('variable', dates[key]);
  };

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

      <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
        <Menu shadow="md" width={220} position="bottom-start">
          <Menu.Target>
            <Button
              size="xs"
              fullWidth
              variant="light"
              leftSection={<IconCalendar size={14} />}
            >
              {value.toLocaleDateString()}
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{tCommon('preset', { count: 1 })}</Menu.Label>
            {presets.map(preset => (
              <Menu.Item
                key={preset.key}
                leftSection={<IconClock size={14} />}

                onClick={() => setPreset(preset.key)}
              >
                {preset.label}
              </Menu.Item>
            ))}

            <Menu.Divider />

            <Menu.Item
              component="div"
              closeMenuOnClick={false}
              style={{ cursor: 'default' }}
            >
              <DateInput
                w="100%"
                size="xs"
                value={value}
                placeholder={tCommon('date')}

                onChange={date => date && form.setFieldValue('variable', new Date(date))}
              />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default TestDateField;

// function DateSkeletons({ style }: { style: DateElement['style'] }) {
//   const t = useTranslations('editor');

//   if (!style) {
//     return <></>;
//   }

//   if (isObject(style)) {
//     return (
//       <>
//         <Tooltip label={t('format')}>
//           <InfoBadge color="blue" variant="outline">
//             {style.pattern}
//           </InfoBadge>
//         </Tooltip>

//         {Object.entries(style.parsedOptions).map(([option, value]) => (
//           <InfoBadge key={option} color="blue" variant="outline">
//             {option}
//             {': '}
//             {value}
//           </InfoBadge>
//         ))}
//       </>
//     );
//   }

//   return (
//     <Tooltip label={t('format')}>
//       <InfoBadge key={style} color="blue" variant="outline">
//         {style}
//       </InfoBadge>
//     </Tooltip>
//   );
// }
