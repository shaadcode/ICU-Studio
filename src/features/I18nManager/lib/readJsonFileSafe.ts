import { jsonrepair } from 'jsonrepair';
import { attemptAsync } from 'es-toolkit';
import { readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

export const readJsonFileSafe = async (path: string) => {
  const [error, raw] = await attemptAsync(() =>
    readTextFile(path, { baseDir: BaseDirectory.AppData }),
  );

  if (error || !raw) {
    return {};
  }

  const [parseError, parsed] = await attemptAsync(async () =>
    JSON.parse(raw),
  );

  if (parseError) {
    const [repairError, repaired] = await attemptAsync(async () =>
      JSON.parse(jsonrepair(raw)),
    );
    return repairError ? {} : repaired;
  }

  return parsed;
};
