import { useTranslations } from 'use-intl';
import { IconStack2, IconFileCode, IconFileText } from '@tabler/icons-react';
import { Card, Text, Group, Stack, ThemeIcon, SimpleGrid } from '@mantine/core';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};
export const StructureDetails = (props: Props) => {
  const t = useTranslations('i18nManager');
  const items = [
    {
      color: 'blue',
      label: t('structure.pattern'),
      icon: <IconStack2 size={16} />,
      hint: t('structure.recommended'),
      value: t('structure.folderPerLocale'),
    },
    {
      color: 'violet',
      icon: <IconFileText size={16} />,
      value: t('structure.fromFolderName'),
      label: t('structure.localeDetection'),
      hasHint: !!props.projectData.locales.length,
      hint: `(${props.projectData.locales.map(l => l.language.code).join(',')})`,
    },
    {
      color: 'green',
      icon: <IconFileCode size={16} />,
      value: t('structure.fromFileName'),
      label: t('structure.namespaceDetection'),
      hasHint: !!props.projectData.namespaces.length,
      hint: `(${props.projectData.namespaces.map(s => s.name).join(',')})`,
    },
  ];

  return (
    <Card withBorder radius="md" padding="md" component={Stack}>
      <Text fw={600} size="sm">
        {t('structure.details')}
      </Text>

      <SimpleGrid spacing="md" cols={{ sm: 3, base: 1 }}>
        {items.map(item => (
          <Stack gap={4} key={item.label}>
            <Group gap={6}>
              <ThemeIcon size={20} radius="sm" variant="light" color={item.color}>
                {item.icon}
              </ThemeIcon>
              <Text size="xs" c="dimmed">
                {item.label}
              </Text>
            </Group>
            <Text fw={500} size="sm">
              {item.value}
            </Text>
            {item.hasHint && (
              <Text truncate size="xs" c="dimmed">
                {item.hint}
              </Text>
            )}
          </Stack>
        ))}
      </SimpleGrid>
    </Card>
  );
};
