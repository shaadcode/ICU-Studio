// components/tabs/Structure/NamespacesTable.tsx
import { useMemo } from 'react';
import { useTranslations } from 'use-intl';
import { useSelection } from '@mantine/hooks';
import { IconTrash, IconStackPop } from '@tabler/icons-react';
import { Card, Text, Group, Table, Stack, Center, ThemeIcon, ActionIcon } from '@mantine/core';

import { NamespaceRow } from './NamespaceRow';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  namespaces: NonNullable<I18nManagerStore['selectedProjectData']>['namespaces'];
};

export const NamespacesTable = ({ namespaces }: Props) => {
  const t = useTranslations('i18nManager');
  const projectData = i18nManagerStore.use.selectedProjectData();

  const data = useMemo(() => namespaces, [namespaces]);

  const [selection, selectionHandlers] = useSelection({
    data,
    resetSelectionOnDataChange: true,
  });

  if (!projectData) {
    return null;
  }

  const isEmpty = namespaces.length === 0;

  return (
    <Card withBorder radius="md" padding="md">
      <Group mb="sm" justify="space-between">
        <Text fw={600} size="sm">
          {t('structure.namespaces')}
        </Text>
        {selection.length > 0 && (
          <ActionIcon
            size="sm"
            color="red"
            variant="subtle"
            aria-label={t('structure.modals.deleteNamespace.title')}

            onClick={() => {
              console.log('delete selected:', selection);
            }}
          >
            <IconTrash size={14} />
          </ActionIcon>
        )}
      </Group>

      {isEmpty
        ? (
            <Center py="md">
              <Stack gap="sm" align="center">
                <ThemeIcon size={50} radius="xl" color="gray" variant="light">
                  <IconStackPop size={26} />
                </ThemeIcon>
                <Text size="sm" c="dimmed" ta="center">
                  {t('structure.emptyNamespaces')}
                </Text>
              </Stack>
            </Center>
          )
        : (
            <Table verticalSpacing="sm" horizontalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('structure.table.name')}</Table.Th>
                  <Table.Th w={40} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {namespaces.map((ns) => {
                  const isSelected = selection.includes(ns);
                  return (
                    <NamespaceRow
                      key={ns}
                      namespaceName={ns}
                      isSelected={isSelected}
                      projectData={projectData}
                      selectionState={selection}
                      selectionHandlers={selectionHandlers}
                    />
                  );
                })}
              </Table.Tbody>
            </Table>
          )}
    </Card>
  );
};
