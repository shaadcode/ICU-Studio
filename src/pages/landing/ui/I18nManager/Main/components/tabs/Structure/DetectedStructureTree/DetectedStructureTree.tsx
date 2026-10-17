import { useTranslations } from 'use-intl';
import { IconFolder, IconFileText, IconFolderOpen } from '@tabler/icons-react';
import { Card, Text, Tree, Group, Stack, useTree, ThemeIcon, ScrollArea } from '@mantine/core';

import DetectedStructureEmptyState from './EmptyState';
import classes from './DetectedStructureTree.module.css';
import { TreeNodeContextMenu } from './TreeNodeContextMenu';
import type { I18nProjectTree } from '@/shared/lib/mantine/getI18nProjectData';
import { AddNamespaceModal } from './HandleAddNamespaceModal/AddNamespaceModal';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const DetectedStructureTree = ({ projectData }: Props) => {
  const t = useTranslations('i18nManager');
  const treeHandlers = useTree();
  const isEmpty = !projectData.tree || projectData.tree.length === 0;

  return (
    <Card withBorder radius="md" padding="md">
      <Stack>
        <Text fw={600} size="sm">
          {t('structure.detectedStructure')}
        </Text>
        {isEmpty
          ? (
              <DetectedStructureEmptyState />
            )
          : (
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
                      <TreeNodeContextMenu
                        node={typedNode}
                        projectData={projectData}
                        isLocale={typedNode.isLocale}
                      >
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
                              {hasChildren || typedNode.isDirectory
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
            )}

        <AddNamespaceModal projectData={projectData} />
      </Stack>
    </Card>
  );
};
