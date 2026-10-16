import { useTranslations } from 'use-intl';
import { IconStack2, IconFileCode, IconFileText } from '@tabler/icons-react';
import { Card, Text, Group, Stack, ThemeIcon, SimpleGrid } from '@mantine/core';

export const StructureDetails = () => {
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
      hint: '(en, fa, de, fr, es)',
      icon: <IconFileText size={16} />,
      value: t('structure.fromFolderName'),
      label: t('structure.localeDetection'),
    },
    {
      color: 'green',
      hint: '(common.json + common)',
      icon: <IconFileCode size={16} />,
      value: t('structure.fromFileName'),
      label: t('structure.namespaceDetection'),
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
            {item.hint && (
              <Text size="xs" c="dimmed">
                {item.hint}
              </Text>
            )}
          </Stack>
        ))}
      </SimpleGrid>
    </Card>
  );
};
