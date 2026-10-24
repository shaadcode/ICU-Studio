import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { JsonEditor as JsonEditorReact } from 'json-edit-react';
import { IconSearch, IconFileCode, IconArrowLeft } from '@tabler/icons-react';

import './JsonEditor.module.css';
import { Box, Text, Group, Paper, Loader, TextInput, ActionIcon } from '@mantine/core';

import { mantineJsonTheme } from './theme';
import classes from './jsonEditorContainer.module.css';
import { useHandleJsonEditor } from './useHandleJsonEditor';

const JsonEditor = () => {
  const { setEntityData, jsonEditorEntityData } = useHandleJsonEditor();
  const [jsonData, setJsonData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations('common');

  useEffect(() => {
    async function loadData() {
      if (!jsonEditorEntityData) {
        setJsonData({});
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const fileContent = await readTextFile(jsonEditorEntityData.path);
        const parsedJson = JSON.parse(fileContent);
        setJsonData(parsedJson);
      } catch (err) {
        console.error('Error loading JSON:', err);
        setError('خطای غیرمنتظره در بارگذاری فایل.');
        setJsonData({});
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [jsonEditorEntityData]);

  if (isLoading) {
    return (
      <Box className={classes['container']}>
        <Box className={classes['stateWrapper']}>
          <Loader size="md" />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={classes['container']}>
        <Box className={classes['stateWrapper']}>
          <Text c="red" fw={500}>
            {error}
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Paper withBorder style={{ overflow: 'hidden' }}>
      <Box className={classes['toolbar']}>
        <ActionIcon
          size="md"
          variant="transparent"

          onClick={() => setEntityData(undefined)}
        >
          <IconArrowLeft size={16} />
        </ActionIcon>

        <Group gap={6} wrap="nowrap">
          <IconFileCode size={16} opacity={0.6} />
          <Text fw={500} truncate size="sm" opacity={0.8}>
            {jsonEditorEntityData?.path?.split(/[\\/]/).pop() ?? 'JSON'}
          </Text>
        </Group>

        <Box className={classes['toolbarSpacer']} />

        <TextInput
          size="xs"
          value={searchQuery}
          placeholder={t('search')}
          className={classes['searchInput']}
          leftSection={<IconSearch size={14} />}
          styles={{
            input: { fontSize: 12 },
          }}

          onChange={e => setSearchQuery(e.currentTarget.value)}
        />
      </Box>
      <Box className={classes['editorWrapper']}>
        <JsonEditorReact
          rootName={''}
          data={jsonData}
          setData={setJsonData}
          theme={mantineJsonTheme}
          searchText={searchQuery}
        />
      </Box>
    </Paper>
  );
};

export default JsonEditor;
