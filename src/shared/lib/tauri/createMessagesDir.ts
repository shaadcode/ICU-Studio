import { mkdir, exists, BaseDirectory } from '@tauri-apps/plugin-fs';

import { MESSAGES_DIR } from './constant';

export async function createMessagesDir() {
  const dirExists = await exists(MESSAGES_DIR, { baseDir: BaseDirectory.AppData });
  if (!dirExists) {
    await mkdir(MESSAGES_DIR, { recursive: true, baseDir: BaseDirectory.AppData });
  }
}
