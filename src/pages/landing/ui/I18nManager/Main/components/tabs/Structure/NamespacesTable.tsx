import { useTranslations } from 'use-intl';
import { IconDots, IconStack2 } from '@tabler/icons-react';
import {
  Card,
  Text,
  Group,
  Table,
  ThemeIcon,
  ActionIcon,
} from '@mantine/core';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  namespaces: NonNullable<I18nManagerStore['selectedProjectData']>['namespaces'];

};

export const NamespacesTable = ({ namespaces }: Props) => {
  const t = useTranslations('i18nManager');
  return (
    <Card withBorder radius="md" padding="md">
      <Text mb="sm" fw={600} size="sm">
        {t('structure.namespaces')}
      </Text>

      <Table verticalSpacing="sm" horizontalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('structure.table.name')}</Table.Th>
            <Table.Th>{t('structure.table.files')}</Table.Th>
            <Table.Th>{t('structure.table.status')}</Table.Th>
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
                  <Text size="sm">{ns}</Text>
                </Group>
              </Table.Td>

              <Table.Td>
                <ActionIcon size="sm" color="gray" variant="subtle">
                  <IconDots size={14} />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
};
