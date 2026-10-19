// shared/config/i18n/patterns/locale-folder-namespace-file/deleteNamespace.ts
import { attemptAsync } from 'es-toolkit';
import { join } from '@tauri-apps/api/path';
import { remove } from '@tauri-apps/plugin-fs';

import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type DeleteNamespaceContext = {
  namespaceName: string;
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
    const { namespaceName, setSelectedProjectData, ...projectData } = params;

    await Promise.all(
      projectData.locales.map(async (locale) => {
        const filePath = await join(locale.path, `${namespaceName}.json`);
        await remove(filePath);
      }),
    );

    const updatedTree = projectData.tree.map((localeNode) => {
      if (!localeNode.isLocale || !localeNode.children) {
        return localeNode;
      }

      return {
        ...localeNode,
        children: localeNode.children.filter((child) => {
          const childNameWithoutExt = String(child.label).replace(/\.json$/, '');
          return childNameWithoutExt !== namespaceName;
        }),
      };
    });

    setSelectedProjectData({
      ...projectData,
      tree: updatedTree,
      namespaces: projectData.namespaces.filter(ns => ns.name !== namespaceName),
    });
  });

  return result;
}
