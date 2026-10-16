import { useTranslations } from 'use-intl';
import { IconPlus, IconFolder, IconMaximize, IconFileText, IconFolderOpen } from '@tabler/icons-react';
import { Card, Text, Tree, Group, Stack, Button, useTree, ThemeIcon, ActionIcon, ScrollArea } from '@mantine/core';

import classes from './DetectedStructureTree.module.css';
import { TreeNodeContextMenu } from './TreeNodeContextMenu';
import type { I18nProjectTree } from '@/shared/lib/mantine/getI18nProjectData';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  onAddNamespace: () => void;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const DetectedStructureTree = ({ projectData, onAddNamespace }: Props) => {
  const t = useTranslations('i18nManager');
  const treeHandlers = useTree();

  return (
    <Card withBorder radius="md" padding="md">
      <Stack>
        <Text fw={600} size="sm">
          {t('structure.detectedStructure')}
        </Text>

        <ScrollArea h={350} type="hover" offsetScrollbars>
          <Tree
            withLines
            selectOnClick
            expandOnClick
            levelOffset={23}
            tree={treeHandlers}
            data={projectData.tree}
            renderNode={({ node, expanded, hasChildren, elementProps }) => {
              const typedNode = node as I18nProjectTree;
              return (
                <TreeNodeContextMenu node={typedNode} isLocale={typedNode.isLocale}>
                  {({ ref, children: _, className: __, ...otherProps }) => {
                    const mergedProps = {
                      ...elementProps,
                      ...otherProps,
                      onClick: (e: any) => {
                        elementProps.onClick(e);
                      // otherProps.onClick(e);
                      },
                    };
                    return (
                      <Group
                        gap={6}
                        wrap="nowrap"
                        classNames={{ root: classes['treeNodeRoot'] }}
                        {...mergedProps}
                      >
                        {hasChildren
                          ? (
                              <ThemeIcon size={16} variant="transparent">
                                {expanded
                                  ? <IconFolderOpen size={14} color="var(--mantine-color-yellow-6)" />
                                  : <IconFolder size={14} color="var(--mantine-color-yellow-6)" />}
                              </ThemeIcon>
                            )
                          : (
                              <ThemeIcon size={16} variant="transparent">
                                <IconFileText size={14} color="var(--mantine-color-blue-6)" />
                              </ThemeIcon>
                            )}

                        <Text
                          fw={500}
                          truncate
                          size="sm"
                          ref={ref}
                        >
                          {node.label}
                        </Text>
                      </Group>
                    );
                  }}
                </TreeNodeContextMenu>
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
      </Stack>
    </Card>
  );
};
