import { useTranslations } from 'use-intl';
import { IconFileText, IconDotsVertical } from '@tabler/icons-react';
import { Box, Text, Card, Table, Group, Divider, Progress, Checkbox, TextInput, ActionIcon, ScrollArea } from '@mantine/core';

import type { LocaleAnalysis } from '@/pages/landing/model/patterns/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  localeCode?: string;
  localeAnalysis: undefined | LocaleAnalysis;
  uniqueNamespaces: NonNullable<I18nManagerStore['selectedProjectData']>['namespaces'];
};

export const NamespacesTable = ({ localeCode, localeAnalysis, uniqueNamespaces }: Props) => {
  const t = useTranslations('i18nManager');
  return (
    <Card withBorder radius="md" padding="md">
      <Group mb="md" justify="space-between">
        <Group gap="xs">
          <Text fw={600} size="sm" tt="capitalize">
            {t('namespaces')}
            {` (${uniqueNamespaces.length})`}
          </Text>
          {localeCode && (
            <>
              <Divider my={6} orientation="vertical" />
              <Text span fw={400} c="dimmed">
                {localeCode.toUpperCase()}
              </Text>
            </>
          )}
        </Group>

        <TextInput
          size="xs"
          placeholder={t('localesTab.searchNamespaces')}
        />
      </Group>

      <ScrollArea>
        <Table verticalSpacing="sm" horizontalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={40}><Checkbox /></Table.Th>
              <Table.Th>{t('localesTab.table.namespace')}</Table.Th>
              <Table.Th>{t('localesTab.table.files')}</Table.Th>
              <Table.Th>{t('localesTab.table.completion')}</Table.Th>
              <Table.Th>{t('localesTab.table.status')}</Table.Th>
              <Table.Th>{t('localesTab.table.lastUpdated')}</Table.Th>
              <Table.Th w={40} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {uniqueNamespaces.map((ns) => {
              const nsAnalysis = localeAnalysis?.namespaces[ns.name];
              const completion = nsAnalysis?.completionPercentage ?? 0;

              let status: 'active' | 'default' | 'partial' | 'missing' | 'complete' | 'incomplete' = 'missing';
              let statusColor = 'red';
              if (completion === 100) {
                status = 'complete';
                statusColor = 'teal';
              } else if (completion > 0) {
                status = 'partial';
                statusColor = 'yellow';
              }

              return (
                <Table.Tr key={ns.path}>
                  <Table.Td><Checkbox /></Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconFileText size={16} color="var(--mantine-color-blue-6)" />
                      <Text size="sm">{ns.name}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td><Text size="sm">{'1'}</Text></Table.Td>
                  <Table.Td>
                    <Group gap="xs" wrap="nowrap">
                      <Progress size="sm" radius="xl" value={completion} color={statusColor} style={{ flex: 1, minWidth: 60 }} />
                      <Text fw={500} size="xs">
                        {completion}
                        {'%'}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={6}>
                      <Box
                        w={8}
                        h={8}
                        bdrs={99}
                        bg={statusColor}
                      />
                      <Text size="sm" tt="capitalize">{t(`localesTab.status.${status}`)}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="dimmed">{'Apr 28, 2025 - 14:32'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon size="sm" color="gray" variant="subtle">
                      <IconDotsVertical size={14} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
};
