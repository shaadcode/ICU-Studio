import { useTranslations } from 'use-intl';
import type { UseFormReturnType } from '@mantine/form';
import { IconWand, IconSparkles } from '@tabler/icons-react';
import { Text, Stack, Group, Alert, ScrollAreaAutosize } from '@mantine/core';

import { STRUCTURE_OPTIONS } from './constants';
import { StructurePreview } from './StructurePreview';
import { StructureOptionCard } from './StructureOptionCard';
import type { StructureType, BaseProjectInfo } from './types';

type Props = {
  form: UseFormReturnType<BaseProjectInfo>;
  onStructureSelect: (value: StructureType) => void;
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

      <Alert
        radius="md"
        color="grape"
        variant="light"
        icon={<IconWand size={16} />}
        title={t('structureDetection.autoDetect')}
      >
        <Group wrap="nowrap" align="flex-start" justify="space-between">
          <Text size="xs" c="dimmed">
            {t('structureDetection.autoDetectDesc')}
          </Text>
        </Group>
      </Alert>

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

              onSelect={props.onStructureSelect}
            />
          ))}
        </Stack>
      </ScrollAreaAutosize>

      <StructurePreview structureType={props.form.values.structureType} />
    </Stack>
  );
};
