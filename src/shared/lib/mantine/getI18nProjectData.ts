import { readDir } from '@tauri-apps/plugin-fs';
import type { TreeNodeData } from '@mantine/core';
import { join, extname } from '@tauri-apps/api/path';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type I18nProjectTree = {
  fullPath: string;
  isDirectory: boolean;
  children?: I18nProjectTree[];
} & TreeNodeData;

export async function getI18nProjectData(projectPath: string) {
  const locales: string[] = [];
  const filesSet = new Set<string>();

  const buildTree = async (dirPath: string, depth = 0): Promise<I18nProjectTree[]> => {
    const entries = await readDir(dirPath);
    const nodes: I18nProjectTree[] = [];

    for (const entry of entries) {
      const ext = await extname(entry.name);

      if (entry.name.startsWith('.') || ext !== 'json') {
        continue;
      }

      const fullPath = await join(dirPath, entry.name);
      const isDir = entry.isDirectory ?? false;

      if (depth === 0 && isDir) {
        locales.push(entry.name);
      }

      const node: I18nProjectTree = {
        fullPath,
        value: fullPath,
        label: entry.name,
        isDirectory: isDir,
      };

      if (isDir) {
        node.children = await buildTree(fullPath, depth + 1);
      } else {
        if (ext === 'json') {
          filesSet.add(entry.name);
        }
      }

      nodes.push(node);
    }

    return nodes;
  };

  const tree = await buildTree(projectPath);
  const files = [...filesSet];

  return {
    tree,
    locales,
    namespaces: files,
    recentScan: new Date(),
    baseLocale: 'baseLocale',
    filesAmount: files.length,
    structureType: 'locale-folder-namespace-file',
    messages: {
      missing: 313,
      translated: 313,
    },
  } as NonNullable<I18nManagerStore['selectedProjectData']>;
}
