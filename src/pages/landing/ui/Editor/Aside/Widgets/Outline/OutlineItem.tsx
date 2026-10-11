import { memo, useState } from 'react';
import { Box, Text, Group, ActionIcon, UnstyledButton } from '@mantine/core';
import { IconTag, IconHash, IconClock, IconBraces, IconNumber, IconVariable, IconCalendar, IconListCheck, IconLetterCase, IconChevronDown, IconListNumbers, IconChevronRight } from '@tabler/icons-react';

import type { OutlineNode } from './buildOutlineTree';

const ICON_MAP: Record<string, typeof IconBraces> = {
  'tag': IconTag,
  'time': IconClock,
  'pound': IconHash,
  'number': IconNumber,
  'date': IconCalendar,
  'unknown': IconBraces,
  'select': IconListCheck,
  'argument': IconVariable,
  'literal': IconLetterCase,
  'plural': IconListNumbers,
  'plural-option': IconBraces,
  'select-option': IconBraces,
  'selectordinal': IconListNumbers,
  'selectordinal-option': IconBraces,
};

const COLOR_MAP: Record<string, string> = {
  'date': 'teal',
  'time': 'cyan',
  'plural': 'red',
  'tag': 'indigo',
  'number': 'blue',
  'literal': 'gray',
  'pound': 'orange',
  'unknown': 'gray',
  'select': 'violet',
  'argument': 'grape',
  'plural-option': 'red',
  'selectordinal': 'orange',
  'select-option': 'violet',
  'selectordinal-option': 'orange',
};

type Props = {
  node: OutlineNode;
  onSelect?: (node: OutlineNode) => void;
};

export const OutlineItem = memo(({ node, onSelect }: Props) => {
  const [opened, setOpened] = useState(true);
  const hasChildren = node.children.length > 0;

  const Icon = ICON_MAP[node.type] ?? IconBraces;
  const color = COLOR_MAP[node.type] ?? 'gray';

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpened(prev => !prev);
  };

  const handleClick = () => {
    onSelect?.(node);
  };

  return (
    <Box>
      <UnstyledButton
        p={4}
        w="100%"
        pl={node.depth * 12 + 4}
        style={{
          borderRadius: 4,
          transition: 'background-color 0.15s',
        }}

        onClick={handleClick}
      >
        <Group gap={6} wrap="nowrap">
          {hasChildren
            ? (
                <ActionIcon
                  size={14}
                  color="gray"
                  variant="transparent"
                  aria-label={opened ? 'Collapse' : 'Expand'}

                  onClick={handleToggle}
                >
                  {opened ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
                </ActionIcon>
              )
            : (
                <Box w={14} />
              )}

          <Box style={{ flexShrink: 0, color: `var(--mantine-color-${color}-6)` }}>
            <Icon size={14} />
          </Box>

          <Text truncate size="xs" style={{ flex: 1 }}>
            {node.label}
          </Text>
        </Group>
      </UnstyledButton>

      {hasChildren && opened && (
        <Box>
          {node.children.map(child => (
            <OutlineItem
              node={child}
              key={child.id}

              onSelect={onSelect}
            />
          ))}
        </Box>
      )}
    </Box>
  );
});

OutlineItem.displayName = 'OutlineItem';
