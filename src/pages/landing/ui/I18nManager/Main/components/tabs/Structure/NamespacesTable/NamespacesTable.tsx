import { uniqBy } from 'es-toolkit';
// components/tabs/Structure/NamespacesTable.tsx
import { useTranslations } from 'use-intl';
import { useSelection } from '@mantine/hooks';
import { IconSquare, IconStackPop, IconCheckbox } from '@tabler/icons-react';
import { Card, Text, Group, Table, Stack, Center, Tooltip, ThemeIcon, ActionIcon } from '@mantine/core';

import { NamespaceRow } from './NamespaceRow';
import OpenDeleteNamespacesConfirm from './DeleteNamespacesConfirmModal';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const NamespacesTable = (params: Props) => {
  const tCommon = useTranslations('common');
  const t = useTranslations('i18nManager');
  const namespaces = params.projectData.namespaces;
  const uniqueNamespaces = uniqBy(namespaces, ns => ns.name);
  const isEmpty = uniqueNamespaces.length === 0;
  const [selection, selectionHandlers] = useSelection({
    data: uniqueNamespaces.map(ns => ns.name),
  });

  return (
    <Card withBorder radius="md" padding="md">
      <Group mb="sm" justify="space-between">
        <Text fw={600} size="sm">
          {t('structure.namespaces')}
        </Text>

        <Group gap="xs">

          {selection.length > 0 && (
            <>
              <Tooltip
                label={
                  selectionHandlers.isAllSelected()
                    ? tCommon('deselectAll')
                    : tCommon('selectAll')
                }
              >
                <ActionIcon
                  size="sm"
                  color="gray"
                  variant="subtle"
                  aria-label={
                    tCommon(selectionHandlers.isAllSelected()
                      ? 'deselectAll'
                      : 'selectAll')
                  }

                  onClick={() => {
                    if (selectionHandlers.isAllSelected()) {
                      selectionHandlers.resetSelection();
                    } else {
                      selectionHandlers.setSelection(uniqueNamespaces.map(ns => ns.name));
                    }
                  }}
                >
                  {selectionHandlers.isAllSelected()
                    ? <IconSquare size={14} />
                    : <IconCheckbox size={14} />}
                </ActionIcon>
              </Tooltip>
              <OpenDeleteNamespacesConfirm
                selection={selection}
                projectData={params.projectData}
              />
            </>
          )}
        </Group>
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
            <Table.ScrollContainer minWidth={500} maxHeight={300}>
              <Table stickyHeader>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t('structure.table.name')}</Table.Th>
                    <Table.Th w={40} />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {uniqueNamespaces.map((ns) => {
                    const isSelected = selection.includes(ns.name);
                    return (
                      <NamespaceRow
                        key={ns.name}
                        namespace={ns}
                        isSelected={isSelected}
                        selectionState={selection}
                        projectData={params.projectData}
                        selectionHandlers={selectionHandlers}
                      />
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

          )}
    </Card>
  );
};
