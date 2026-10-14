import { useTranslations } from 'use-intl';
import { Card, Text, Group, Stack, ThemeIcon, SimpleGrid } from '@mantine/core';
import { IconFolder, IconStack2, IconLanguage, IconFileText } from '@tabler/icons-react';

import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export const StatsCards = () => {
  const t = useTranslations('i18nManager');
  const selectedProjectData = i18nManagerStore.use.selectedProjectData();

  const items = [
    {
      color: 'blue',
      key: 'locales',
      icon: <IconLanguage size={18} />,
      title: t('stats.detectedLocales'),
      value: String(selectedProjectData?.locales.length),
    },
    {
      color: 'violet',
      key: 'namespaces',
      title: t('stats.namespaces'),
      icon: <IconStack2 size={18} />,
      value: selectedProjectData?.namespaces.length,
    },
    {
      key: 'files',
      color: 'green',
      title: t('stats.files'),
      icon: <IconFileText size={18} />,
      value: selectedProjectData?.filesAmount,
    },
    {
      color: 'orange',
      key: 'structure',
      icon: <IconFolder size={18} />,
      title: t('stats.structureType'),
      value: selectedProjectData?.structureType,
    },
  ];

  return (
    <SimpleGrid spacing="md" cols={{ sm: 2, lg: 4, base: 1 }}>
      {items.map(item => (
        <Card withBorder radius="md" padding="md" key={item.key}>
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon size={36} radius="md" variant="light" color={item.color}>
              {item.icon}
            </ThemeIcon>
            <Stack gap={0} style={{ minWidth: 0 }}>
              <Text size="xs" c="dimmed">
                {item.title}
              </Text>
              <Text truncate fw={600} lh={1.2}>
                {item.value}
              </Text>
            </Stack>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
};
