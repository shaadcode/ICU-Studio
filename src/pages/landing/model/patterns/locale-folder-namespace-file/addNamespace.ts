import { attemptAsync } from 'es-toolkit';
import { join } from '@tauri-apps/api/path';
import type { UnwatchFn } from '@tauri-apps/plugin-fs';
import { stat, watch, writeTextFile } from '@tauri-apps/plugin-fs';

import type { NamespaceTreeNode } from '../types';
import { isLocaleNode } from './getProjectData/getProjectData';
import { handleWatchLocaleFolderNamespaceFile } from './handleWatch';
import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type AddNamespaceContext = {
  /**
   * namespace name
   */
  namespace: string;
  setProjectAnalysis: NonNullable<I18nManagerStore['actions']>['setProjectAnalysis'];
  setSelectedProjectData: NonNullable<I18nManagerStore['actions']['setSelectedProjectData']>;
  setStopWatchingLocalesAndNamespacesFns: NonNullable<I18nManagerStore['actions']['setStopWatchingLocalesAndNamespacesFns']>;
} & NonNullable<I18nManagerStore['selectedProjectData']>;

/**
 * Add a new namespace file to all locale folders.
 * Pattern: `locale-folder-namespace-file`
 */
export async function addNamespace(params: AddNamespaceContext) {
  const { namespace, setProjectAnalysis, setSelectedProjectData, ...projectData } = params;

  return attemptAsync(async () => {
    const stopWatchFns: Array<UnwatchFn> = [];
    const newNamespaces = await Promise.all(
      projectData.locales.map(async (locale) => {
        const namespaceFileName = `${namespace}.json`;

        const newNamespacePath = await join(locale.path, namespaceFileName);

        await writeTextFile(newNamespacePath, '{}\n');

        const namespaceStat = await stat(newNamespacePath);

        const stop = await watch(newNamespacePath, (event) => {
          handleWatchLocaleFolderNamespaceFile({
            event,
            isDir: false,
            setProjectAnalysis,
            ...projectData,
          });
        });
        stopWatchFns.push(stop);

        return {
          name: namespace,
          path: newNamespacePath,
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
            locale: node.locale,
            fileName: namespaceFileName,
            lastModified: namespaceStat.mtime,
          },
        };

        return { ...node, children: [...(node.children ?? []), newChild] };
      }),
    );

    params.setStopWatchingLocalesAndNamespacesFns(prev => ([...prev, ...stopWatchFns]));

    setSelectedProjectData({
      ...projectData,
      tree: updatedTree,
      namespaces: [...projectData.namespaces, ...newNamespaces],
    });
  });
}
