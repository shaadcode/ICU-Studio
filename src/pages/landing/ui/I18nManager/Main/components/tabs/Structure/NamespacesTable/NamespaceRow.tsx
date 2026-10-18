import { useTranslations } from 'use-intl';
import { useLongPress } from '@mantine/hooks';
import type { UseSelectionHandlers } from '@mantine/hooks';
import { IconTrash, IconStack2 } from '@tabler/icons-react';
import { Text, Table, Group, Checkbox, ThemeIcon, ActionIcon } from '@mantine/core';

import { NamespaceRowMenu } from './NamespaceRowMenu';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  isSelected: boolean;
  namespaceName: string;
  selectionState: Array<string>;
  selectionHandlers: UseSelectionHandlers<string>;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const NamespaceRow = (props: Props) => {
  const t = useTranslations('i18nManager');
  const isSelectedMode = props.selectionHandlers.isSomeSelected();

  const longPressHandlers = useLongPress(
    () => {
      props.selectionHandlers.select(props.namespaceName);
    },
    {
      onStart: () => isSelectedMode
        && props.selectionHandlers.toggle(props.namespaceName),
    },
  );

  return (
    <Table.Tr
      style={{ cursor: 'pointer', userSelect: 'none' }}
      bg={props.isSelected ? 'var(--mantine-color-blue-light)' : undefined}

      {...longPressHandlers}
    >
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          {isSelectedMode && (
            <Checkbox
              checked={props.isSelected}

              onClick={e => e.stopPropagation()}
              onChange={() => props.selectionHandlers.toggle(props.namespaceName)}
            />
          )}
          <ThemeIcon size={20} color="gray" variant="transparent">
            <IconStack2 size={14} />
          </ThemeIcon>
          <Text size="sm" tt="capitalize">
            {props.namespaceName}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        {props.isSelected
          ? (
              <ActionIcon
                size="sm"
                color="red"
                variant="subtle"
                aria-label={t('structure.modals.deleteNamespace.title')}

                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: onDelete
                }}
              >
                <IconTrash size={14} />
              </ActionIcon>
            )
          : (
              !isSelectedMode && (
                <NamespaceRowMenu
                  projectData={props.projectData}
                  namespaceName={props.namespaceName}
                />
              )
            )}
      </Table.Td>
    </Table.Tr>
  );
};
