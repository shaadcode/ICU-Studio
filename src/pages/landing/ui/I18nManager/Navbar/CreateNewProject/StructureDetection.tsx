import { useTranslations } from 'use-intl';
import { IconSparkles } from '@tabler/icons-react';
import type { UseFormReturnType } from '@mantine/form';
import { Text, Stack, Group, ScrollAreaAutosize } from '@mantine/core';

import type { BaseProjectInfo } from './types';
import { STRUCTURE_OPTIONS } from './constants';
import { StructurePreview } from './StructurePreview';
import { StructureOptionCard } from './StructureOptionCard';

type Props = {
  form: UseFormReturnType<BaseProjectInfo>;
};

export const StructureDetection = (props: Props) => {
  const t = useTranslations('i18nManager');
  return (
    <Stack gap="md">
      <Group gap="xs">
        <IconSparkles size={18} />
        <Text fw={600}>{t('structureDetection.title')}</Text>
      </Group>

      <Text size="sm" c="dimmed">
        {t('structureDetection.description')}
      </Text>

      <Text fw={500} size="sm">
        {t('structureDetection.manualSelection')}
      </Text>

      <ScrollAreaAutosize mah={250}>
        <Stack gap="xs">
          {STRUCTURE_OPTIONS.map(opt => (
            <StructureOptionCard
              option={opt}
              key={opt.value}
              isSelected={props.form.values.structureType === opt.value}

              onSelect={v => props.form.setFieldValue('structureType', v)}
            />
          ))}
        </Stack>
      </ScrollAreaAutosize>

      <StructurePreview structureType={props.form.values.structureType} />
    </Stack>
  );
};
