// shared/config/i18n/patterns/locale-folder-namespace-file/deleteNamespace.ts
import { attemptAsync } from 'es-toolkit';
import { join } from '@tauri-apps/api/path';
import { remove } from '@tauri-apps/plugin-fs';

import { isLocaleNode } from './getProjectData';
import { readAndFlattenJsonFile } from './analyze';
import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type DeleteNamespaceContext = {
  namespace: Project['namespaces'][number];
  setSelectedProjectData: NonNullable<
    I18nManagerStore['actions']['setSelectedProjectData']
  >;
} & NonNullable<I18nManagerStore['selectedProjectData']>;

/**
 * Delete a namespace file from all locale folders.
 * Pattern: `locale-folder-namespace-file`
 */
export async function deleteNamespaceFolderNamespaceFile(params: DeleteNamespaceContext) {
  const result = await attemptAsync(async () => {
    const { namespace, setSelectedProjectData, ...projectData } = params;
    await Promise.all(
      projectData.locales.map(async (locale) => {
        const namespaceBasedLocalePath = await join(locale.path, namespace.fileName);
        await remove(namespaceBasedLocalePath);
      }),
    );

    const updatedTree = projectData.tree.map((node) => {
      if (!isLocaleNode(node)) {
        return node;
      }

      return {
        ...node,
        children: node.children.filter(child => child.label !== namespace.name),
      };
    });

    setSelectedProjectData({
      ...projectData,
      tree: updatedTree,
      namespaces: projectData.namespaces.filter(ns => ns.name !== namespace.name),
    });
    readAndFlattenJsonFile.cache.delete(namespace.path);
  });

  return result;
}
