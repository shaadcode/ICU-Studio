import { useTranslations } from 'use-intl';
import { Card, Text, Stack, Group, ThemeIcon, UnstyledButton } from '@mantine/core';
import {
  IconDownload,
  IconFolderOpen,
  IconFileArrowRight,
} from '@tabler/icons-react';

const icons = {
  download: IconDownload,
  explorer: IconFolderOpen,
  convert: IconFileArrowRight,
};

type Props = {
  actions: any[];
  onConvertCsv: () => void;
  onExportReport: () => void;
  onOpenExplorer: () => void;
};

export const QuickActions = ({
  actions,
  onConvertCsv,
  onExportReport,
  onOpenExplorer,
}: Props) => {
  const t = useTranslations('i18nManager');
  const handlers: Record<string, () => void> = {
    convertCsv: onConvertCsv,
    exportReport: onExportReport,
    openExplorer: onOpenExplorer,
  };

  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="sm" fw={600} size="sm">
        {t('quickActions.title')}
      </Text>

      <Stack gap={4}>
        {actions.map((action) => {
          const Icon = icons[action.icon as keyof typeof icons];
          return (
            <UnstyledButton
              p="xs"
              key={action.key}
              style={{ borderRadius: 8 }}
              className="hover:bg-gray-50"

              onClick={handlers[action.key]}
            >
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon size={28} radius="sm" color="blue" variant="light">
                  <Icon size={14} />
                </ThemeIcon>
                <Stack gap={0} style={{ minWidth: 0 }}>
                  <Text fw={500} size="xs">
                    {action.title}
                  </Text>
                  <Text truncate size="xs" c="dimmed">
                    {action.description}
                  </Text>
                </Stack>
              </Group>
            </UnstyledButton>
          );
        })}
      </Stack>
    </Card>
  );
};
