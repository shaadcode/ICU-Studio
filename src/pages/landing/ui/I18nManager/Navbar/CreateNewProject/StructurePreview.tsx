import { useTranslations } from 'use-intl';
import { IconCheck } from '@tabler/icons-react';
import { Box, Text, Code, Group, Paper, Stack, SimpleGrid, ScrollAreaAutosize } from '@mantine/core';

import type { StructureType } from './types';
import { STRUCTURE_PREVIEWS } from './constants';

type Props = {
  structureType: StructureType;
};

export const StructurePreview = (props: Props) => {
  const preview = STRUCTURE_PREVIEWS[props.structureType];
  const t = useTranslations('i18nManager');

  return (
    <Box>
      <Text mb="xs" fw={500} size="sm">
        {t('structureDetection.preview')}
      </Text>
      <SimpleGrid cols={2} spacing="xs">
        <Paper p="sm" h={150} withBorder radius="md">
          <ScrollAreaAutosize mah={'100%'}>
            <Code block fz={10}>
              {preview.tree}
            </Code>
          </ScrollAreaAutosize>
        </Paper>
        <Paper p="sm" withBorder radius="md">
          <Stack gap={4}>
            <Text fw={600} size="xs">
              {t('structureDetection.wellDetect')}
            </Text>
            {preview.detectItems.map(item => (
              <Group gap={4} key={item}>
                <IconCheck size={14} color="var(--mantine-color-green-6)" />
                <Text size="xs">{item}</Text>
              </Group>
            ))}
          </Stack>
        </Paper>
      </SimpleGrid>
    </Box>
  );
};
