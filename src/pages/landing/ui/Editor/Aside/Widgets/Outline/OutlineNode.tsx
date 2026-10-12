import { memo } from 'react';
import type { RenderTreeNodePayload } from '@mantine/core';
import { Text, Group, Space, ActionIcon, useComputedColorScheme } from '@mantine/core';
import {
  IconTag,
  IconHash,
  IconClock,
  IconBraces,
  IconNumber,
  IconVariable,
  IconCalendar,
  IconListCheck,
  IconLetterCase,
  IconListNumbers,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';

import { icuEditorStore } from '@/pages/landing/config/store/editor';
import { makeColorValue, VARIABLE_COLORS } from '@/shared/lib/mantine';
import type { MessageOutlineData } from '@/shared/lib/mantine/constant';

const NODE_ICONS = {
  'tag': IconTag,
  'time': IconClock,
  'pound': IconHash,
  'number': IconNumber,
  'date': IconCalendar,
  'unknown': IconBraces,
  'select': IconListCheck,
  'argument': IconVariable,
  'plural': IconListNumbers,
  'literal': IconLetterCase,
  'plural-option': IconBraces,
  'select-option': IconBraces,
  'selectordinal': IconListNumbers,
  'selectordinal-option': IconBraces,
} as const;

const NODE_COLOR_KEYS: Record<NodeType, keyof typeof VARIABLE_COLORS> = {
  'tag': 'tag',
  'time': 'time',
  'date': 'date',
  'pound': 'pound',
  'number': 'number',
  'plural': 'plural',
  'select': 'select',
  'literal': 'literal',
  'argument': 'argument',
  'plural-option': 'plural',
  'select-option': 'select',
  'selectordinal': 'selectordinal',
  'selectordinal-option': 'selectordinal',
};

type NodeType = MessageOutlineData['type'];

export const OutlineNode = memo((props: RenderTreeNodePayload) => {
  const typedNode = props.node as MessageOutlineData;
  const nodeType = typedNode.type ?? 'root';
  const colorScheme = useComputedColorScheme('light');
  const Icon = NODE_ICONS[nodeType] ?? IconBraces;
  const colorKey = NODE_COLOR_KEYS[nodeType] ?? 'argument';
  const { color } = VARIABLE_COLORS[colorKey];
  const colorValue = makeColorValue(color, colorScheme);
  const editor = icuEditorStore.use.editorInstance();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.tree.toggleExpanded(props.node.value);
  };

  const handleDoubleClickLabel = () => {
    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .setTextSelection({
        to: typedNode.location.end.offset + 1,
        from: typedNode.location.start.offset + 1,
      })
      .scrollIntoView()
      .run();
  };

  return (
    <Group gap={4} wrap="nowrap" {...props.elementProps} onClick={undefined}>
      {props.hasChildren
        ? (
            <ActionIcon
              bdrs={4}
              size={16}
              color="gray"
              variant="subtle"
              aria-label={props.expanded ? 'Collapse' : 'Expand'}

              onClick={handleToggle}
            >
              {props.expanded
                ? <IconChevronDown size="80%" />
                : <IconChevronRight size="80%" />}
            </ActionIcon>
          )
        : <Space w="md" />}

      <Group
        gap={6}
        wrap="nowrap"
        style={{ cursor: 'pointer' }}

        onDoubleClick={handleDoubleClickLabel}
      >
        <Icon size={14} color={colorValue} />

        <Text truncate size="sm">
          {props.node.label}
        </Text>
      </Group>
    </Group>
  );
});

OutlineNode.displayName = 'OutlineNode';
