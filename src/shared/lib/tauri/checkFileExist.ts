import { exists, BaseDirectory } from '@tauri-apps/plugin-fs';

export async function checkFileExist(path: string) {
  return await exists(path, { baseDir: BaseDirectory.AppData });
}
