// components/tabs/Structure/NamespacesTable/NamespaceTableRow.tsx
import dayjs from 'dayjs';
import { IconFileText } from '@tabler/icons-react';
import { Box, Text, Group, Table, Progress, Checkbox } from '@mantine/core';

import { NamespaceTableRowMenu } from './NamespaceRowMenu';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { NamespaceAnalysis } from '@/pages/landing/model/patterns/types';
import type { Project, Namespace } from '@/pages/landing/config/store/i18nManager/types';

type Status = 'partial' | 'missing' | 'complete';

type Props = {
  isSelected: boolean;
  namespace: Namespace;
  projectData: Project;
  isBaseLocale: boolean;
  onToggleSelect: (code: string) => void;
  nsAnalysis: undefined | NamespaceAnalysis;
};

export function NamespaceTableRow({
  namespace,
  nsAnalysis,
  isSelected,
  projectData,
  isBaseLocale,
  onToggleSelect,
}: Props) {
  const completion = nsAnalysis?.completionPercentage ?? 0;
  const { color, status } = getStatus(completion);
  const analayzeProject = i18nManagerStore.use.actions().analyzeProject;
  const formattedDate = namespace.lastModified
    ? dayjs(namespace.lastModified).format('MMM DD, YYYY - HH:mm')
    : undefined;

  return (
    <Table.Tr>
      <Table.Td>
        <Checkbox
          checked={isSelected}

          onClick={e => e.stopPropagation()}
          onChange={() => onToggleSelect(namespace.path)}
        />
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <IconFileText size={16} color="var(--mantine-color-blue-6)" />
          <Text
            size="sm"

            onClick={analayzeProject}
          >
            {namespace.name}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          <Progress
            size="sm"
            radius="xl"
            color={color}
            value={completion}
            style={{ flex: 1, minWidth: 60 }}
          />
          <Text fw={500} size="xs">
            {completion}
            {'%\r'}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text size="xs" c="dimmed">
          {nsAnalysis ? `${nsAnalysis.translatedKeys} / ${nsAnalysis.totalKeys}` : '—'}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text size="xs" c={nsAnalysis && nsAnalysis.missingKeys > 0 ? 'red' : 'dimmed'}>
          {isBaseLocale ? '—' : (nsAnalysis?.missingKeys ?? '—')}
        </Text>
      </Table.Td>

      <Table.Td>
        {isBaseLocale
          ? (
              <Text size="xs" c="dimmed">{'—'}</Text>
            )
          : nsAnalysis && nsAnalysis.extraKeysCount > 0
            ? (
                <Text fw={500} size="xs" c="yellow.7">
                  {nsAnalysis.extraKeysCount}
                </Text>
              )
            : (
                <Text size="xs" c="dimmed">{'0'}</Text>
              )}
      </Table.Td>

      <Table.Td>
        <Group gap={6}>
          <Box w={8} h={8} bdrs={99} bg={color} />
          <Text size="sm" tt="capitalize">{status}</Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text size="xs" c="dimmed">{formattedDate ?? '-'}</Text>
      </Table.Td>

      <Table.Td>
        <NamespaceTableRowMenu namespace={namespace} projectData={projectData} />
      </Table.Td>
    </Table.Tr>
  );
}

function getStatus(completion: number): { color: string; status: Status } {
  if (completion >= 100) {
    return { color: 'teal', status: 'complete' };
  }
  if (completion > 0) {
    return { color: 'yellow', status: 'partial' };
  }
  return { color: 'red', status: 'missing' };
}
