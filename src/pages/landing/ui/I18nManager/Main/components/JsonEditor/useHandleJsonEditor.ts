import { attemptAsync } from 'es-toolkit';
import type { JsonValue } from 'type-fest';
import { useTranslations } from 'use-intl';
import { useHotkeys } from '@mantine/hooks';
import { useUndo } from '@json-edit-react/utils';
import { useRef, useState, useEffect } from 'react';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import type { JsonEditorHandle } from 'json-edit-react';

import { createMantineJsonTheme } from './theme';
import { hotkeys } from '@/shared/config/mantine/hotKeys';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { JsonEditReactSearchFilters } from './JsonEditorHeader/JsonEditorHeader';

export type OnBackJsonEditor = (params?: { saveChanges?: boolean }) => Promise<void>;

export function useHandleJsonEditor() {
  const isSavingRef = useRef(false);
  const jsonEditorEntityData = i18nManagerStore.use.jsonData();
  const setJsonDataStore = i18nManagerStore.use.actions().setJsonData;
  const setChangedJsonFileInWatch = i18nManagerStore.use.actions().setChangedJsonFileInWatch;
  const setChangedJsonFilePathInOut = i18nManagerStore.use.actions().setChangedJsonFilePathInOut;
  const loadJsonFromFile = i18nManagerStore.use.actions().loadJsonFromFile;
  const [rawJsonData, setRawJsonData] = useState<JsonValue>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileName, setFileName] = useState('***');
  const t = useTranslations();
  const editorRef = useRef<JsonEditorHandle>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filterMode, setFilterMode] = useState<JsonEditReactSearchFilters>('all');
  const mantineJsonTheme = createMantineJsonTheme(t);
  const updateJsonData = (v: null | JsonValue) => setRawJsonData(v ?? {});
  const { undo, redo, reset, canRedo, canUndo, data: jsonData, set: setJsonData } = useUndo<JsonValue>(rawJsonData, updateJsonData);

  async function loadData() {
    if (!jsonEditorEntityData) {
      setRawJsonData({});
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await loadJsonFromFile(jsonEditorEntityData.path);

    if (result.ok) {
      setRawJsonData(result.data);
      setFileName(result.fileName);
    } else {
      console.error('Error loading JSON:', result.error);
      setError(t('i18nManager.jsonEditor.loadError'));
      setRawJsonData({});
      setFileName('***');
    }

    setIsLoading(false);
  }

  const saveUpdatedJson = async () => {
    if (!jsonEditorEntityData) {
      return;
    }
    await attemptAsync(async () => {
      isSavingRef.current = true;
      reset(jsonData);
      await writeTextFile(jsonEditorEntityData.path, JSON.stringify(jsonData));
    });

    setTimeout(() => {
      isSavingRef.current = false;
    }, 3000);
  };

  useHotkeys(
    [
      [hotkeys.JsonEditor.saveChanges, saveUpdatedJson],
    ],
    [],
    true,
  );

  useEffect(() => {
    loadData();
  }, [jsonEditorEntityData]);

  useEffect(() => {
    const unsubscribe = i18nManagerStore.subscribe(
      state => state.changedJsonFileInWatch,
      () => {
        if (isSavingRef.current) {
          return;
        }
        loadData();
      },

    );
    return unsubscribe;
  }, []);

  const onBack: OnBackJsonEditor = async (params) => {
    if (params?.saveChanges) {
      saveUpdatedJson();
    }
    setChangedJsonFileInWatch(0);
    setChangedJsonFilePathInOut(undefined);
    setJsonDataStore(undefined);
  };

  return {
    t,
    undo,
    redo,
    error,
    onBack,
    canRedo,
    canUndo,
    fileName,
    jsonData,
    isLoading,
    editorRef,
    isEditing,
    filterMode,
    searchQuery,
    setJsonData,
    setIsEditing,
    setFilterMode,
    setSearchQuery,
    setJsonDataStore,
    mantineJsonTheme,
    jsonEditorEntityData,
  };
}
