// components/tabs/Structure/NamespacesTable.tsx
import { useTranslations } from 'use-intl';
import { IconStack2, IconStackPop } from '@tabler/icons-react';
import { Card, Text, Group, Table, Stack, Center, ThemeIcon } from '@mantine/core';

import { NamespaceRowMenu } from './NamespaceRowMenu';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  namespaces: NonNullable<I18nManagerStore['selectedProjectData']>['namespaces'];
};

export const NamespacesTable = ({ namespaces }: Props) => {
  const t = useTranslations('i18nManager');

  const projectData = i18nManagerStore.use.selectedProjectData();

  if (!projectData) {
    return null;
  }

  const isEmpty = namespaces.length === 0;

  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="sm" fw={600} size="sm">
        {t('structure.namespaces')}
      </Text>

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
                {namespaces.map(ns => (
                  <Table.Tr key={ns}>
                    <Table.Td>
                      <Group gap="xs">
                        <ThemeIcon size={20} color="gray" variant="transparent">
                          <IconStack2 size={14} />
                        </ThemeIcon>
                        <Text size="sm" tt="capitalize">
                          {ns}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <NamespaceRowMenu
                        namespaceName={ns}
                        projectData={projectData}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
    </Card>
  );
};
