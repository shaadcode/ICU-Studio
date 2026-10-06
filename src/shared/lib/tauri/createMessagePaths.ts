import { join } from '@tauri-apps/api/path';

import { MESSAGES_DIR } from './constant';
import type { MessageSchema } from '@/pages/landing/ui/Messages/Navbar/CreateMessage/CreateMessage';

export async function createMessagePaths(message: MessageSchema) {
  const fileName = `${message.name}.txt`;
  const relativePath = await join(MESSAGES_DIR, fileName);

  return {
    fileName,
    relativePath,
  };
}
