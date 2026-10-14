import { useTranslations } from 'use-intl';
import { IconPlus, IconFolder, IconMaximize, IconFileText, IconFolderOpen } from '@tabler/icons-react';
import { Card, Text, Tree, Group, Button, useTree, ThemeIcon, ActionIcon, ScrollArea } from '@mantine/core';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  onAddNamespace: () => void;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const DetectedStructureTree = ({ projectData, onAddNamespace }: Props) => {
  const t = useTranslations('i18nManager');
  const treeHandlers = useTree();

  return (
    <Card h="100%" withBorder radius="md" padding="md">
      <Group mb="md" justify="space-between">
        <Text fw={600} size="sm">
          {t('structure.detectedStructure')}
        </Text>
        <Text size="xs" c="dimmed">
          {t('structure.autoDetected')}
        </Text>
      </Group>

      <ScrollArea h={480} type="hover" offsetScrollbars>
        <Tree
          withLines
          selectOnClick
          expandOnClick
          levelOffset={23}
          tree={treeHandlers}
          data={projectData.tree}
          renderNode={({ node, expanded, hasChildren, elementProps }) => {
            return (
              <Group gap={6} wrap="nowrap" {...elementProps}>
                {hasChildren
                  ? (
                      <ThemeIcon size={16} color="yellow" variant="transparent">
                        {expanded ? <IconFolderOpen size={14} /> : <IconFolder size={14} />}
                      </ThemeIcon>
                    )
                  : (
                      <ThemeIcon size={16} color="blue" variant="transparent">
                        <IconFileText size={14} />
                      </ThemeIcon>
                    )}

                <Text
                  fw={500}
                  truncate
                  size="sm"
                >
                  {node.label}
                </Text>
              </Group>
            );
          }}
        />
      </ScrollArea>

      <Group mt="md" justify="space-between">
        <Button
          size="xs"
          variant="filled"
          leftSection={<IconPlus size={14} />}

          onClick={onAddNamespace}
        >
          {t('structure.addNamespace')}
        </Button>
        <ActionIcon size="sm" color="gray" variant="subtle">
          <IconMaximize size={14} />
        </ActionIcon>
      </Group>
    </Card>
  );
};
