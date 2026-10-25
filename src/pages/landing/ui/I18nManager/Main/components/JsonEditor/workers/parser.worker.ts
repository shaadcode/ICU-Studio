import { expose } from 'comlink';
import type { JsonValue } from 'type-fest';

const jsonParseApi = {
  parse: (content: string): JsonValue => {
    return JSON.parse(content) as JsonValue;
  },
};

export type JsonParseWorkerApi = typeof jsonParseApi;

expose(jsonParseApi);
