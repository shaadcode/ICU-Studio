import { useTree } from '@mantine/core';
import type { Primitive } from '@mantine/core';

import type { JsonTreeNode } from './JsonNode';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export function useHandleJsonEditor() {
  const jsonEditorEntityData = i18nManagerStore.use.entityData();
  const setEntityData = i18nManagerStore.use.actions().setEntityData;

  const tree = useTree();

  return {
    tree,
    setEntityData,
    jsonEditorEntityData,
  };
}

export function buildTreeFromFlattenedJson(
  flattenedJson: Record<string, Primitive | Array<Primitive>>,
  parentKey = '',
): JsonTreeNode[] {
  const groups: Record<string, Record<string, Primitive | Array<Primitive>>> = {};
  for (const [fullKeyPath, value] of Object.entries(flattenedJson)) {
    if (parentKey && !fullKeyPath.startsWith(`${parentKey}.`)) {
      continue;
    }

    const childrenKeyPaths = parentKey ? fullKeyPath.slice(parentKey.length + 1) : fullKeyPath;
    const [head = '', ...tail] = childrenKeyPaths.split('.');

    if (!groups[head]) {
      groups[head] = {};
    }

    if (tail.length > 0) {
      const nestedKey = parentKey || childrenKeyPaths;
      groups[head][nestedKey] = value;
    } else {
      groups[head][head] = value;
    }
  }

  const nodes: JsonTreeNode[] = [];

  for (const [groupName, group] of Object.entries(groups)) {
    const hasChildren = Object.keys(group).some(k => k !== groupName);
    const nodeValue = parentKey ? `${parentKey}.${groupName}` : groupName;
    nodes.push(
      hasChildren
        ? {
            label: groupName,
            value: nodeValue,
            hasChildren: true,
            children: buildTreeFromFlattenedJson(group, nodeValue),
          }
        : {
            label: groupName,
            value: nodeValue,
            nodeProps: {
              message: group[groupName] ?? '',
            },
          },
    );
  }

  return nodes;
}
