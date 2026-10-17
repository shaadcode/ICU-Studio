import { readDir } from '@tauri-apps/plugin-fs';
import { join, extname } from '@tauri-apps/api/path';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type I18nProjectTree = {
  /**
   * full path dir or file(just for rendering and state management)
   */
  value: string;
  /**
   * file or directory path
   */
  fullPath: string;
  isLocale: boolean;
  isNamespace: boolean;
  isDirectory: boolean;
  /**
   * file or dir name(namespace)
   */
  label: React.ReactNode;
  children?: I18nProjectTree[];
};

type Locales = NonNullable<I18nManagerStore['selectedProjectData']>['locales'];

export async function getI18nProjectData(selectedProject: NonNullable<I18nManagerStore['selectedProject']>) {
  const locales: Locales = [];
  const filesSet = new Set<string>();

  const buildTree = async (dirPath: string, depth = 0): Promise<I18nProjectTree[]> => {
    const entries = await readDir(dirPath);
    const nodes: I18nProjectTree[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        continue;
      }

      const fullPath = await join(dirPath, entry.name);
      const isDir = entry.isDirectory ?? false;

      if (depth === 0 && isDir) {
        locales.push({
          path: fullPath,
          code: entry.name,
        });
      }

      const entryName = entry.name.split('.')[0] as string;

      const node: I18nProjectTree = {
        fullPath,
        value: fullPath,
        isLocale: isDir,
        label: entryName,
        isDirectory: isDir,
        isNamespace: !isDir,
      };

      const ext = isDir ? '' : await extname(entry.name);
      if (isDir) {
        node.children = await buildTree(fullPath, depth + 1);
      } else {
        if (ext === 'json') {
          filesSet.add(entryName);
        }
      }
      if (isDir || ext === 'json') {
        nodes.push(node);
      }
    }

    return nodes;
  };

  const tree = await buildTree(selectedProject.baseDirectoryPath);
  const files = [...filesSet];

  return {
    tree,
    locales,
    namespaces: files,
    recentScan: new Date(),
    filesAmount: files.length,
    path: selectedProject.baseDirectoryPath,
    baseLocale: selectedProject.baseLocale ?? '',
    structureType: 'locale-folder-namespace-file',
    messages: {
      missing: 313,
      translated: 313,
    },
  } as NonNullable<I18nManagerStore['selectedProjectData']>;
}
