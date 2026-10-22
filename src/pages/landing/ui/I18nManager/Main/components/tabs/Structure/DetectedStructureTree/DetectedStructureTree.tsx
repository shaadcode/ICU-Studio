import { useTranslations } from 'use-intl';
import { IconFileText } from '@tabler/icons-react';
import { CountryFlagRounded } from '@appica/country-flags-react';
import { Card, Text, Tree, Group, Stack, useTree, Divider, ThemeIcon, ScrollArea } from '@mantine/core';

import DetectedStructureEmptyState from './EmptyState';
import classes from './DetectedStructureTree.module.css';
import { TreeNodeContextMenu } from './TreeNodeContextMenu';
import type { I18nProjectTree } from '@/pages/landing/model/patterns/types';
import { AddNamespaceModal } from './HandleAddNamespaceModal/AddNamespaceModal';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { BaseProjectInfo } from '@/pages/landing/ui/I18nManager/Navbar/CreateNewProject/types';
import { isLocaleNode } from '@/pages/landing/model/patterns/locale-folder-namespace-file/getProjectData/getProjectData';

type Props = {
  project: BaseProjectInfo;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const DetectedStructureTree = ({ project, projectData }: Props) => {
  const t = useTranslations('i18nManager');
  const treeHandlers = useTree();
  const isEmpty = !projectData.tree || projectData.tree.length === 0;

  return (
    <Card withBorder radius="md" padding="md">
      <Stack>
        <Text fw={600} size="sm">
          {t('structure.detectedStructure')}
        </Text>
        <Divider />
        {isEmpty
          ? (
              <DetectedStructureEmptyState />
            )
          : (
              <ScrollArea h={350} type="hover" offsetScrollbars>
                <Tree
                  withLines
                  tree={treeHandlers}
                  data={projectData.tree}
                  renderNode={({ node, level, elementProps }) => {
                    const typedNode = node as I18nProjectTree;
                    return (
                      <TreeNodeContextMenu
                        node={typedNode}
                        projectData={projectData}
                      >
                        {({ ref, children: _, className: __, ...otherProps }) => {
                          const mergedProps = {
                            ...elementProps,
                            ...otherProps,
                            onClick: elementProps.onClick,
                          };

                          return (
                            <Group
                              gap={6}
                              wrap="nowrap"
                              p={level === 1 ? 4 : undefined}
                              classNames={{ root: classes['treeNodeRoot'] }}
                              {...mergedProps}
                            >
                              {isLocaleNode(typedNode)
                                ? (
                                    <CountryFlagRounded
                                      size={20}
                                      code={typedNode.locale?.region ?? 'un'}
                                    />
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
        <AddNamespaceModal project={project} projectData={projectData} />
      </Stack>
    </Card>
  );
};
