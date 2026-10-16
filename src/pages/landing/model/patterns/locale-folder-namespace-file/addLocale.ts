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

export async function name(params: AddLocaleContext) {
  const [error] = await attemptAsync(async () => {
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
        const newNamespaceFilePath = await join(localeFolderPath, ns);
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
      locales: [...projectData.locales, newLocaleCode],
    });
    return { files, localePath: localeFolderPath };
  });

  if (error) {
    console.error(error);
  }
}
