// shared/config/i18n/patterns/locale-folder-namespace-file/addNamespace.ts
import { attemptAsync } from 'es-toolkit';
import { join } from '@tauri-apps/api/path';
import { writeTextFile } from '@tauri-apps/plugin-fs';

import type { I18nProjectTree } from '../types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type AddNamespaceContext = {
  namespaceName: string;
  setSelectedProjectData: NonNullable<
    I18nManagerStore['actions']['setSelectedProjectData']
  >;
} & NonNullable<I18nManagerStore['selectedProjectData']>;

/**
 * Add a new namespace file to all locale folders.
 * Pattern: `locale-folder-namespace-file`
 */
export async function addNamespaceFolderNamespaceFile(params: AddNamespaceContext) {
  const result = await attemptAsync(async () => {
    const { namespaceName, setSelectedProjectData, ...projectData } = params;

    await Promise.all(
      projectData.locales.map(async (locale) => {
        const newNamespaceFilePath = await join(locale.path, `${namespaceName}.json`);
        const content = '{}\n';

        await writeTextFile(newNamespaceFilePath, content);
      }),
    );
    const updatedTree = projectData.tree.map((node) => {
      if (!node.isLocale) {
        return node;
      }

      const newNamespaceFilePath = `${node.fullPath}/${namespaceName}`;

      const newChild: I18nProjectTree = {
        isLocale: false,
        isNamespace: true,
        isDirectory: false,
        label: namespaceName,
        value: newNamespaceFilePath,
        fullPath: newNamespaceFilePath,
      };

      return {
        ...node,
        children: [...(node.children ?? []), newChild],
      };
    });

    setSelectedProjectData({
      ...projectData,
      tree: updatedTree,
      namespaces: [...projectData.namespaces, namespaceName],
    });
  });
  return result;
}
