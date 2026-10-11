import { useTranslations } from 'use-intl';
// Widgets/Variables/VariableItem.tsx
import { memo, useRef, useCallback } from 'react';
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

  const timerRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const isLongPressRef = useRef(false);

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

  const handlePointerDown = useCallback(() => {
    isLongPressRef.current = false;

    if (isSelected) {
      return;
    }

    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onSelect(variable.referenceId);
    }, LONG_PRESS_THRESHOLD);
  }, [isSelected, onSelect, variable.referenceId]);

  const handlePointerUp = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }

    if (!hasSelection) {
      return;
    }

    if (isSelected) {
      onToggleSelect(variable.referenceId);
    } else {
      onSelect(variable.referenceId);
    }
  }, [hasSelection, isSelected, onSelect, onToggleSelect, variable.referenceId]);

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

      onClick={handleClick}
      onPointerUp={handlePointerUp}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
    >
      <Stack gap={6}>
        <Group gap="xs" wrap="nowrap" justify="space-between">
          <Group gap={6} wrap="nowrap">
            {isSelected && <IconCheck size={14} color={colorValue} />}

            <VariableActions
              editor={editor}
              eventTrigger="click"
              elementType={variable.keywordType}
              referenceId={variable.referenceId}
            >
              {({ ref, children: _, className: __, ...otherProps }) => (
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

            <Text
              fw={600}
              truncate
              size="sm"
              style={{ cursor: 'pointer', color: colorValue }}

              onClick={handleSelectDefinition}
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
