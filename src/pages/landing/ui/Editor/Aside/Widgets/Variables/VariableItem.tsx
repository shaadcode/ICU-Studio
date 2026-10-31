// Widgets/Variables/VariableItem.tsx
import { memo, useCallback } from 'react';
import { useTranslations } from 'use-intl';
import { useLongPress } from '@mantine/hooks';
import { IconCheck, IconDotsVertical } from '@tabler/icons-react';
import {
  Text,
  Group,
  Paper,
  Stack,
  Badge,
  ActionIcon,
  useComputedColorScheme,
} from '@mantine/core';

import { icuEditorStore } from '@/pages/landing/config/store/editor';
import { makeColorValue, VARIABLE_COLORS } from '@/shared/lib/mantine';
import type { ICUEditorStore } from '@/pages/landing/config/store/editor';
import VariableActions from '@/shared/lib/mantine/SpanMarkView/MarkActions/VariableActions';

const LONG_PRESS_THRESHOLD = 500;

type Props = {
  isSelected: boolean;
  hasSelection: boolean;
  onSelect: (referenceId: string) => void;
  variable: ICUEditorStore['variables'][number];
  onToggleSelect: (referenceId: string) => void;
};

export const VariableItem = memo(({
  variable,
  onSelect,
  isSelected,
  hasSelection,
  onToggleSelect,
}: Props) => {
  const editor = icuEditorStore.use.editorInstance();
  const t = useTranslations('editor');
  const typeLabel = t(`messageFormatEnum.${variable.enumType}`);

  const { color } = VARIABLE_COLORS[variable.keywordType];
  const colorScheme = useComputedColorScheme('light');
  const colorValue = makeColorValue(color, colorScheme);

  const handleSelectDefinition = useCallback(() => {
    if (editor && variable.location) {
      editor
        .chain()
        .focus()
        .setTextSelection({
          to: variable.location.end.offset + 1,
          from: variable.location.start.offset + 1,
        })
        .run();
    }
  }, [editor, variable.location]);

  const longPressHandlers = useLongPress(
    () => onSelect(variable.referenceId),
    {
      threshold: LONG_PRESS_THRESHOLD,
      onStart: () => {
        if (hasSelection) {
          onToggleSelect(variable.referenceId);
        }
      },
    },
  );

  if (!editor) {
    return null;
  }

  return (
    <Paper
      p="xs"
      withBorder
      radius="sm"
      style={{
        cursor: hasSelection ? 'pointer' : 'default',
        transition: 'background-color 0.15s, border-color 0.15s',
        ...(isSelected && {
          borderColor: colorValue,
          backgroundColor: `color-mix(in srgb, ${colorValue} 10%, transparent)`,
        }),
      }}

      {...longPressHandlers}
    >
      <Stack gap={6}>
        <Group gap="xs" wrap="nowrap" justify="space-between">
          <Group gap={6} wrap="nowrap">
            {isSelected && <IconCheck size={14} color={colorValue} />}

            {!hasSelection && (
              <VariableActions
                editor={editor}
                eventTrigger="click"
                elementType={variable.keywordType}
                referenceId={variable.referenceId}
              >
                {({
                  ref,
                  children: _,
                  className: __,
                  ...otherProps
                }) => (
                  <ActionIcon
                    size="sm"
                    ref={ref}
                    color="gray"
                    variant="subtle"
                    {...otherProps}
                  >
                    <IconDotsVertical size={14} />
                  </ActionIcon>
                )}
              </VariableActions>
            )}

            <Text
              fw={600}
              truncate
              size="sm"
              maw="200px"
              style={{ cursor: 'pointer', color: colorValue, userSelect: 'none' }}

              onDoubleClick={handleSelectDefinition}
            >
              {variable.name}
            </Text>
          </Group>

          <Badge size="xs" tt="lowercase" variant="light">
            {typeLabel}
          </Badge>
        </Group>
      </Stack>
    </Paper>
  );
});

VariableItem.displayName = 'VariableItem';
