import { useLongPress } from '@mantine/hooks';
import { IconStack2 } from '@tabler/icons-react';
import type { UseSelectionHandlers } from '@mantine/hooks';
import { Text, Table, Group, Checkbox, ThemeIcon } from '@mantine/core';

import { NamespaceRowMenu } from './NamespaceRowMenu';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  isSelected: boolean;
  selectionState: Array<string>;
  selectionHandlers: UseSelectionHandlers<string>;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
  namespace: NonNullable<I18nManagerStore['selectedProjectData']>['namespaces'][number];
};

export const NamespaceRow = (props: Props) => {
  const isSelectedMode = props.selectionHandlers.isSomeSelected();

  const longPressHandlers = useLongPress(
    () => {
      props.selectionHandlers.select(props.namespace.name);
    },
    {
      onStart: () => {
        isSelectedMode
        && props.selectionHandlers.toggle(props.namespace.name);
      },
    },
  );

  return (
    <Table.Tr
      style={{ cursor: 'pointer', userSelect: 'none' }}

      {...longPressHandlers}
    >
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          {isSelectedMode && (
            <Checkbox size="xs" checked={props.isSelected} />
          )}
          <ThemeIcon size={20} color="gray" variant="transparent">
            <IconStack2 size={14} />
          </ThemeIcon>
          <Text size="sm" tt="capitalize">
            {props.namespace.name}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td h={45}>
        {!isSelectedMode && (
          <NamespaceRowMenu
            projectData={props.projectData}
            namespaceName={props.namespace.name}
          />
        )}
      </Table.Td>
    </Table.Tr>
  );
};
