import { attemptAsync } from 'es-toolkit';
import { join } from '@tauri-apps/api/path';
import { stat, mkdir, writeTextFile } from '@tauri-apps/plugin-fs';

import { resolveLocale } from './getProjectData/getProjectData';
import type { LocaleTreeNode, NamespaceTreeNode } from '../types';
import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { BaseProjectInfo } from '@/pages/landing/ui/I18nManager/Navbar/CreateNewProject/types';

export type AddLocaleContext = {
  projectData: Project;
  newLocaleCode: string;
  newLocaleLabel: string;
  project: BaseProjectInfo;
  setSelectedProjectData: NonNullable<I18nManagerStore['actions']['setSelectedProjectData']>;
};

/**
 * add a locale folder with all its namespace files.
 * Pattern: `locale-folder-namespace-file`
 */
export async function addLocaleFolderNamespaceFile(params: AddLocaleContext) {
  const result = await attemptAsync(async () => {
    const { projectData, newLocaleCode, setSelectedProjectData } = params;
    const localePath = await join(params.project.path, newLocaleCode);
    const localeData = resolveLocale(newLocaleCode, localePath);

    if (!localeData) {
      console.error('newLocaleCode is invalid');
      return;
    }

    await mkdir(localePath);

    const localeTreeNode = {
      type: 'locale',
      isDirectory: true,
      value: localePath,
      locale: localeData,
      label: newLocaleCode,
      children: [] as Array<NamespaceTreeNode>,
    } as const satisfies LocaleTreeNode;

    const files = await Promise.all(
      projectData.namespaces.map(async (ns) => {
        const namespaceFileName = `${ns.name}.json`;
        const newNamespaceFilePath = await join(localePath, namespaceFileName);
        await writeTextFile(newNamespaceFilePath, '{}\n');
        const namespaceStat = await stat(newNamespaceFilePath);

        const newNamespace: Project['namespaces'][number] = {
          name: ns.name,
          locale: localeData,
          path: newNamespaceFilePath,
          fileName: namespaceFileName,
          lastModified: namespaceStat.mtime,
        };
        const namespaceTreeNode = {
          label: ns.name,
          type: 'namespace',
          isDirectory: false,
          namespace: newNamespace,
          value: newNamespaceFilePath,
        } as const satisfies NamespaceTreeNode;
        localeTreeNode.children.push(namespaceTreeNode);
      }),
    );

    setSelectedProjectData({
      ...projectData,
      tree: [...projectData.tree, localeTreeNode],
      locales: [...projectData.locales, localeData],
    });
    return { files, localePath };
  });

  return result;
}
