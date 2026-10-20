import { attemptAsync } from 'es-toolkit';
import { join } from '@tauri-apps/api/path';
import { stat, writeTextFile } from '@tauri-apps/plugin-fs';

import { isLocaleNode } from './getProjectData';
import type { NamespaceTreeNode } from '../types';
import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type AddNamespaceContext = {
  /**
   * namespace name
   */
  namespace: string;
  setSelectedProjectData: NonNullable<I18nManagerStore['actions']['setSelectedProjectData']>;
} & NonNullable<I18nManagerStore['selectedProjectData']>;

/**
 * Add a new namespace file to all locale folders.
 * Pattern: `locale-folder-namespace-file`
 */
export async function addNamespace(params: AddNamespaceContext) {
  const { namespace, setSelectedProjectData, ...projectData } = params;

  return attemptAsync(async () => {
    const newNamespaces = await Promise.all(
      projectData.locales.map(async (locale) => {
        const namespaceFileName = `${namespace}.json`;

        const path = await join(locale.path, namespaceFileName);
        const namespaceStat = await stat(path);

        await writeTextFile(path, '{}\n');
        return {
          path,
          name: namespace,
          fileName: namespaceFileName,
          lastModified: namespaceStat.mtime,
        } as Project['namespaces'][number];
      }),
    );

    const updatedTree = await Promise.all(
      projectData.tree.map(async (node) => {
        if (!isLocaleNode(node)) {
          return node;
        }
        const namespaceFileName = `${namespace}.json`;
        const path = await join(node.value, namespaceFileName);
        const namespaceStat = await stat(path);
        const newChild: NamespaceTreeNode = {
          value: path,
          label: namespace,
          type: 'namespace',
          isDirectory: false,
          namespace: {
            path,
            name: namespace,
            fileName: namespaceFileName,
            lastModified: namespaceStat.mtime,
          },
        };

        return { ...node, children: [...(node.children ?? []), newChild] };
      }),
    );

    setSelectedProjectData({
      ...projectData,
      tree: updatedTree,
      namespaces: [...projectData.namespaces, ...newNamespaces],
    });
  });
}
