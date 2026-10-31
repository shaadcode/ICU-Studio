import { attemptAsync } from 'es-toolkit';
import { join } from '@tauri-apps/api/path';
import type { UnwatchFn } from '@tauri-apps/plugin-fs';
import { stat, watch, writeTextFile } from '@tauri-apps/plugin-fs';

import type { NamespaceTreeNode } from '../types';
import { isLocaleNode } from './getProjectData/getProjectData';
import { handleWatchLocaleFolderNamespaceFile } from './handleWatch';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { Locale, Namespace } from '@/pages/landing/config/store/i18nManager/types';

export type AddNamespaceContext = {
  /**
   * namespace name
   */
  namespace: string;
  baseLocale: Locale;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
  setProjectAnalysis: NonNullable<I18nManagerStore['actions']>['setProjectAnalysis'];
  setSelectedProjectData: NonNullable<I18nManagerStore['actions']['setSelectedProjectData']>;
  setStopWatchingLocalesAndNamespacesFns: NonNullable<I18nManagerStore['actions']['setStopWatchingLocalesAndNamespacesFns']>;
};

/**
 * Add a new namespace file to all locale folders.
 * Pattern: `locale-folder-namespace-file`
 */
export async function addNamespace(params: AddNamespaceContext) {
  const { namespace, baseLocale, projectData, setProjectAnalysis, setSelectedProjectData } = params;

  return attemptAsync(async () => {
    const stopWatchFns: Array<UnwatchFn> = [];
    const newNamespaces = await Promise.all(
      projectData.locales.map(async (locale) => {
        const namespaceFileName = `${namespace}.json`;

        const newNamespacePath = await join(locale.path, namespaceFileName);

        await writeTextFile(newNamespacePath, '{}\n');

        const namespaceStat = await stat(newNamespacePath);

        const stop = await watch(newNamespacePath, (event) => {
          // @ts-expect-error
          handleWatchLocaleFolderNamespaceFile({
            event,
            baseLocale,
            isDir: false,
            setProjectAnalysis,
            path: newNamespacePath,
            locales: projectData.locales,
            namespaces: projectData.namespaces,

          });
        });
        stopWatchFns.push(stop);

        const newNamespace: Namespace = {
          locale,
          name: namespace,
          path: newNamespacePath,
          fileName: namespaceFileName,
          lastModified: namespaceStat.mtime,
        };

        return newNamespace;
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
