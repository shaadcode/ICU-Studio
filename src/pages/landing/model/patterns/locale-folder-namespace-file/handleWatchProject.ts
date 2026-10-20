import { watch } from '@tauri-apps/plugin-fs';

export type HandleWatchParams = {
  projectPath: string;
};

/**
 * Watches project changes (without locales and namespaces)
 * Pattern: `locale-folder-namespace-file`
 */
export async function handleWatchProjectLocaleFolderNamespaceFile(params: HandleWatchParams) {
  await watch(params.projectPath, () => {
  });
}
