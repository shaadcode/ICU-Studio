import { wrap } from 'comlink';
import type { JsonValue } from 'type-fest';
import { basename } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { isFunction, attemptAsync } from 'es-toolkit';

import type { I18nManagerStore } from '..';
import type { Locale, Namespace } from '../types';
import type { ZustandSlice } from '@/shared/config/zustand/types';
import type { JsonParseWorkerApi } from '@/pages/landing/ui/I18nManager/Main/components/JsonEditor/workers/parser.worker';

export type JsonEditorSlice = {
  changedJsonFileInWatch: number;
  actions: JsonEditorSliceActions;
  jsonData: Locale | Namespace | undefined;
  changedJsonFilePathInOut: string | undefined;
};

type LoadJsonResult
  = | { ok: false; error: unknown }
    | { ok: true; data: JsonValue; fileName: string };

type JsonEditorSliceActions = {
  loadJsonFromFile: (path: string) => Promise<LoadJsonResult>;
  setChangedJsonFilePathInOut: (filePath: string | undefined) => void;
  setJsonData: (callback: JsonEditorSlice['jsonData'] | ((prev: JsonEditorSlice['jsonData']) => JsonEditorSlice['jsonData'])) => void;
  setChangedJsonFileInWatch: (callback: JsonEditorSlice['changedJsonFileInWatch'] | ((prev: JsonEditorSlice['changedJsonFileInWatch']) => JsonEditorSlice['changedJsonFileInWatch'])) => void;

};

const jsonParseWorker = new Worker(
  new URL('./../../../../ui/I18nManager/Main/components/JsonEditor/workers/parser.worker.ts', import.meta.url),
  { type: 'module' },
);
const jsonParseApi = wrap<JsonParseWorkerApi>(jsonParseWorker);

export const createJsonEditorSlice: ZustandSlice<
  I18nManagerStore,
  JsonEditorSlice
> = set => ({
  jsonData: undefined,
  changedJsonFileInWatch: 0,
  changedJsonFilePathInOut: undefined,
  actions: {
    setChangedJsonFilePathInOut: v => set({ changedJsonFilePathInOut: v }),
    setJsonData: cb => set(state => ({
      jsonData: isFunction(cb)
        ? cb(state.jsonData)
        : cb,
    })),
    setChangedJsonFileInWatch: cb => set(state => ({
      changedJsonFileInWatch: isFunction(cb)
        ? cb(state.changedJsonFileInWatch)
        : cb,
    })),
    loadJsonFromFile: async (path: string) => {
      const [err, result] = await attemptAsync(async () => {
        const content = await readTextFile(path);
        const parsed = await jsonParseApi.parse(content);
        const name = await basename(path);
        return { data: parsed, fileName: name };
      });

      if (result) {
        return { ok: true, data: result.data, fileName: result.fileName };
      }
      return { ok: false, error: err };
    },
  },
});
