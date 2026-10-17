import { attemptAsync } from 'es-toolkit';
import { join } from '@tauri-apps/api/path';
import { mkdir, writeTextFile } from '@tauri-apps/plugin-fs';

import type { I18nProjectTree } from '@/shared/lib/mantine/getI18nProjectData';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

export type AddLocaleContext = {
  newLocaleCode: string;
  newLocaleLabel: string;
  setSelectedProjectData: NonNullable<I18nManagerStore['actions']['setSelectedProjectData']>;
} & NonNullable<I18nManagerStore['selectedProjectData']>;

/**
 * add a locale folder with all its namespace files.
 * Pattern: `locale-folder-namespace-file`
 */
export async function addLocaleFolderNamespaceFile(params: AddLocaleContext) {
  const result = await attemptAsync(async () => {
    const { newLocaleCode, setSelectedProjectData, ...projectData } = params;

    const localeFolderPath = await join(projectData.path, newLocaleCode);
    await mkdir(localeFolderPath);

    const localeTreeNode = {
      isLocale: true,
      isDirectory: true,
      isNamespace: false,
      label: newLocaleCode,
      value: localeFolderPath,
      fullPath: localeFolderPath,
      children: [] as Array<I18nProjectTree>,
    } as const satisfies I18nProjectTree;

    const files = await Promise.all(
      projectData.namespaces.map(async (ns) => {
        const newNamespaceFilePath = await join(localeFolderPath, `${ns}.json`);
        const content = '{}\n';

        await writeTextFile(newNamespaceFilePath, content);
        const namespaceTreeNode = {
          label: ns,
          isLocale: false,
          isNamespace: true,
          isDirectory: false,
          value: newNamespaceFilePath,
          fullPath: newNamespaceFilePath,
        } as const satisfies I18nProjectTree;
        localeTreeNode.children.push(namespaceTreeNode);
        return { content, path: newNamespaceFilePath };
      }),
    );
    setSelectedProjectData({
      ...projectData,
      tree: [...projectData.tree, localeTreeNode],
      locales: [...projectData.locales, { code: newLocaleCode, path: localeFolderPath }],
    });
    return { files, localePath: localeFolderPath };
  });

  return result;
}
