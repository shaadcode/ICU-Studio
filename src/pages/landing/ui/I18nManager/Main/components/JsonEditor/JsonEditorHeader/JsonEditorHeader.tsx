import { useTranslations } from 'use-intl';
import type { JsonEditorHandle } from 'json-edit-react';
import { Box, Text, Menu, Group, Tooltip, ActionIcon, ActionIconGroup } from '@mantine/core';
import {
  IconDots,
  IconFileCode,
  IconArrowBackUp,
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconArrowForwardUp,
} from '@tabler/icons-react';

import { JsonSearch } from '../JsonSearch';
import { JsonEditorBackButton } from './JsonEditorBackButton';
import type { OnBackJsonEditor } from '../useHandleJsonEditor';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { RevealInExplorerMenuItem } from '../../tabs/Structure/DetectedStructureTree/context-menu-items/RevealInExplorerMenuItem';

export type JsonEditReactSearchFilters = 'all' | 'key' | 'value';

export const JSON_EDITOR_HEADER_HEIGHT = 60;

type Props = {
  fileName: string;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onExpandAll: () => void;
  onBack: OnBackJsonEditor;
  onCollapseAll: () => void;
  onSearch: (query: string) => void;
  filterMode: JsonEditReactSearchFilters;
  editorRef: React.RefObject<null | JsonEditorHandle>;
  onFilterChange: (filter: JsonEditReactSearchFilters) => void;
};

export const JsonEditorHeader = ({
  onBack,
  onRedo,
  onUndo,
  canRedo,
  canUndo,
  fileName,
  onSearch,
  editorRef,
  onExpandAll,
  onCollapseAll,
  onFilterChange,
}: Props) => {
  const t = useTranslations('i18nManager');
  const jsonEntityData = i18nManagerStore.use.jsonData();

  if (!jsonEntityData) {
    return null;
  }

  return (
    <Group p="sm" wrap="nowrap" justify="space-between" h={JSON_EDITOR_HEADER_HEIGHT}>
      <Group wrap="nowrap">
        <JsonEditorBackButton
          canUndo={canUndo}

          onBack={onBack}
        />
        <Group gap={4} wrap="nowrap">
          <Box w={10} h={10} bdrs={999} bg={'yellow.7'} display={canUndo ? undefined : 'none'} />
          <IconFileCode size={16} opacity={0.6} />
          <Tooltip label={jsonEntityData.path}>
            <Text fw={500} truncate size="sm" opacity={0.8}>
              {fileName}
            </Text>
          </Tooltip>
        </Group>
      </Group>

      <Group wrap="nowrap">

        <ActionIconGroup>
          <Tooltip label={t('jsonEditor.undo')}>
            <ActionIcon
              size="sm"
              variant="subtle"
              disabled={!canUndo}

              onClick={onUndo}
            >
              <IconArrowBackUp size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('jsonEditor.redo')}>
            <ActionIcon
              size="sm"
              variant="subtle"
              disabled={!canRedo}

              onClick={onRedo}
            >
              <IconArrowForwardUp size={14} />
            </ActionIcon>
          </Tooltip>
        </ActionIconGroup>
        <ActionIconGroup>
          <Tooltip label={t('jsonEditor.expandAll')}>
            <ActionIcon
              size="sm"
              variant="subtle"

              onClick={onExpandAll}
            >
              <IconArrowsMaximize size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('jsonEditor.collapseAll')}>
            <ActionIcon
              size="sm"
              variant="subtle"

              onClick={onCollapseAll}
            >
              <IconArrowsMinimize size={14} />
            </ActionIcon>
          </Tooltip>
        </ActionIconGroup>
        <JsonSearch onSearch={onSearch} onFilterChange={onFilterChange} />
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon size="sm" variant="subtle" aria-label="More options">
              <IconDots size={14} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => editorRef.current?.startEdit({ path: [] })}>
              {t('jsonEditor.editRoot')}
            </Menu.Item>
            <RevealInExplorerMenuItem path={jsonEntityData.path} />
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};
