import { Box, Text, Code, Group, Paper, Radio, ThemeIcon } from '@mantine/core';

import type { StructureType, StructureOption } from './types';

type Props = {
  isSelected: boolean;
  option: StructureOption;
  onSelect: (value: StructureType) => void;
};

export const StructureOptionCard = ({ option, onSelect, isSelected }: Props) => {
  return (
    <Paper
      p="sm"
      withBorder
      radius="md"
      style={{ cursor: 'pointer' }}
      bd={
        isSelected
          ? '1px solid var(--mantine-color-orange-6)'
          : undefined
      }

      onClick={() => onSelect(option.value)}
    >
      <Group wrap="nowrap" align="flex-start">
        <Radio
          mt={2}
          size="xs"
          checked={isSelected}

          onChange={() => onSelect(option.value)}
        />
        <ThemeIcon size="md" color="gray" variant="light">
          {option.icon}
        </ThemeIcon>
        <Box style={{ flex: 1 }}>
          <Text fw={500} size="sm">
            {option.title}
          </Text>
          <Text mt={2} size="xs" c="dimmed">
            {option.description}
          </Text>
          <Code block mt={4} fz={10}>
            {option.example}
          </Code>
        </Box>
      </Group>
    </Paper>
  );
};
