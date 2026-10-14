import { useTranslations } from 'use-intl';
import {
  IconStack2,
  IconRefresh,
  IconFileCode,
  IconFileText,
} from '@tabler/icons-react';
import {
  Card,
  Text,
  Group,
  Stack,
  Button,
  ThemeIcon,
  SimpleGrid,
} from '@mantine/core';

type Props = {
  onRescan: () => void;
};

export const StructureDetails = ({ onRescan }: Props) => {
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
    <Card withBorder radius="md" padding="md">
      <Group mb="md" justify="space-between">
        <Text fw={600} size="sm">
          {t('structure.details')}
        </Text>
        <Button
          size="xs"
          variant="default"
          leftSection={<IconRefresh size={14} />}

          onClick={onRescan}
        >
          {t('structure.rescan')}
        </Button>
      </Group>

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
