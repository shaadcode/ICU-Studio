import { JsonEditor as JsonEditorReact } from 'json-edit-react';
import { Box, Text, Paper, Loader, ScrollAreaAutosize } from '@mantine/core';

import { CopyPathButton } from './CopyPathButton';
import classes from './jsonEditorContainer.module.css';
import './JsonEditor.module.css';
import { useHandleJsonEditor } from './useHandleJsonEditor';
import { ROOT_LAYOUT_HEADER_HEIGHT } from '@/pages/landing/ui/useHandleLanding';
import { JsonEditorHeader, JSON_EDITOR_HEADER_HEIGHT } from './JsonEditorHeader/JsonEditorHeader';

const JsonEditor = () => {
  const h = useHandleJsonEditor();

  if (h.isLoading) {
    return (
      <Box className={classes['container']}>
        <Box className={classes['stateWrapper']}>
          <Loader size="md" />
        </Box>
      </Box>
    );
  }

  if (h.error) {
    return (
      <Box className={classes['container']}>
        <Box className={classes['stateWrapper']}>
          <Text c="red" fw={500}>{h.error}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Paper
      flex={1}
      withBorder
      display="flex"
      style={{ overflow: 'hidden', flexDirection: 'column' }}
    >
      <JsonEditorHeader
        canUndo={h.canUndo}
        canRedo={h.canRedo}
        fileName={h.fileName}
        editorRef={h.editorRef}
        filterMode={h.filterMode}

        onUndo={h.undo}
        onRedo={h.redo}
        onBack={h.onBack}
        onSearch={h.setSearchQuery}
        onFilterChange={h.setFilterMode}
        onExpandAll={() =>
          h.editorRef.current?.collapse({
            path: [],
            collapsed: false,
            includeChildren: true,
          })}
        onCollapseAll={() =>
          h.editorRef.current?.collapse({
            path: [],
            collapsed: true,
            includeChildren: true,
          })}
      />
      <ScrollAreaAutosize
        h="100%"
        className={classes['editorWrapper']}
        data-is-editing={h.isEditing || undefined}
        mah={`calc(100dvh - ${JSON_EDITOR_HEADER_HEIGHT + ROOT_LAYOUT_HEADER_HEIGHT + 35}px)`}
        styles={h.isEditing
          ? {
              root: { height: '100%' },
              content: { height: '100%' },
              viewport: { height: '100%' },
            }
          : undefined}
      >
        <JsonEditorReact
          rootName={''}
          data={h.jsonData}
          searchDebounceTime={0}
          editorRef={h.editorRef}
          setData={h.setJsonData}
          collapseAnimationTime={0}
          theme={h.mantineJsonTheme}
          searchText={h.searchQuery}
          searchFilter={h.filterMode}
          customButtons={[{ Element: CopyPathButton }]}

          onUpdate={({ newData }) => console.log(newData)}
          onEditEvent={(params) => {
            h.setIsEditing(params.event === 'startEdit' && !params.path.length);
          }}
        />
      </ScrollAreaAutosize>

    </Paper>
  );
};

export default JsonEditor;
