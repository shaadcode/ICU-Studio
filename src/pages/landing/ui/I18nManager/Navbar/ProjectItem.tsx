import { useState } from 'react';
import { useTranslations } from 'use-intl';
import { readDir } from '@tauri-apps/plugin-fs';
import { IconFolder, IconFileText, IconChevronRight } from '@tabler/icons-react';
import { Box, Text, Group, Stack, Paper, Loader, Collapse, ActionIcon } from '@mantine/core';

import type { ProjectSchema } from './CreateNewProject/types';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  project: ProjectSchema;
};

type FileEntry = {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileEntry[];
};

export const ProjectItem = ({ project }: Props) => {
  const t = useTranslations('i18nManager');
  const [opened, setOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tree, setTree] = useState<FileEntry[]>([]);
  const selectedProject = i18nManagerStore.use.selectedProject();
  const setSelectedProject = i18nManagerStore.use.actions().setSelectedProject;

  const isSelected = selectedProject?.baseDirectoryPath === project.baseDirectoryPath;

  // ─── خواندن بازگشتی درخت فایل‌ها ─────────────────────────
  const buildTree = async (path: string, depth = 0): Promise<FileEntry[]> => {
    if (depth > 3) {
      return [];
    } // جلوگیری از عمق بیش از حد

    const entries = await readDir(path);
    const result: FileEntry[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        continue;
      } // فایل‌های مخفی

      const fullPath = `${path}/${entry.name}`;
      const isDir = entry.isDirectory;

      const node: FileEntry = {
        path: fullPath,
        name: entry.name,
        isDirectory: isDir,
      };

      if (isDir) {
        node.children = await buildTree(fullPath, depth + 1);
      }

      result.push(node);
    }

    // مرتب‌سازی: پوشه‌ها اول، سپس فایل‌ها
    return result.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  };

  const handleToggle = async () => {
    // انتخاب پروژه
    setSelectedProject(project);

    if (!opened && tree.length === 0) {
      setIsLoading(true);
      try {
        const result = await buildTree(project.baseDirectoryPath);
        setTree(result);
      } catch (error) {
        console.error('Failed to read directory:', error);
      } finally {
        setIsLoading(false);
      }
    }

    setOpened(prev => !prev);
  };

  return (
    <Box>
      <Paper
        p="xs"
        radius="md"
        withBorder={isSelected}
        style={{ cursor: 'pointer' }}
        bg={isSelected ? 'var(--mantine-color-blue-0)' : undefined}

        onClick={handleToggle}
      >
        <Group gap="xs" wrap="nowrap" justify="space-between">
          <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            <IconFolder
              size={16}
              style={{ flexShrink: 0 }}
              color="var(--mantine-color-blue-6)"
            />
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Text fz="sm" fw={500} truncate>
                {project.name}
              </Text>
              <Text fz="xs" truncate c="dimmed">
                {project.baseDirectoryPath}
              </Text>
            </Box>
          </Group>

          <ActionIcon
            size="sm"
            color="gray"
            variant="subtle"

            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
          >
            <IconChevronRight
              size={16}
              style={{
                transition: 'transform 200ms ease',
                transform: opened ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
            />
          </ActionIcon>
        </Group>
      </Paper>

      <Collapse expanded={opened}>
        <Box pl="lg" pt="xs">
          {isLoading
            ? (
                <Group py="xs" gap="xs">
                  <Loader size="xs" />
                  <Text fz="xs" c="dimmed">
                    {t('loadingState')}
                  </Text>
                </Group>
              )
            : (
                <FileTree entries={tree} />
              )}
        </Box>
      </Collapse>
    </Box>
  );
};

function FileTree({ entries }: { entries: FileEntry[] }) {
  return (
    <Stack gap={2}>
      {entries.map(entry => (
        <FileTreeNode entry={entry} key={entry.path} />
      ))}
    </Stack>
  );
};

function FileTreeNode({ entry }: { entry: FileEntry }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = entry.isDirectory && entry.children && entry.children.length > 0;

  return (
    <>
      <Group
        gap={4}
        wrap="nowrap"
        style={{ cursor: hasChildren ? 'pointer' : 'default' }}

        onClick={() => hasChildren && setIsOpen(p => !p)}
      >
        {entry.isDirectory
          ? (
              <IconChevronRight
                size={12}
                style={{
                  opacity: hasChildren ? 1 : 0,
                  transition: 'transform 200ms ease',
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              />
            )
          : (
              <Box w={12} />
            )}
        {entry.isDirectory
          ? (
              <IconFolder size={14} color="var(--mantine-color-yellow-6)" />
            )
          : (
              <IconFileText size={14} color="var(--mantine-color-gray-6)" />
            )}
        <Text fz="xs" truncate c={entry.isDirectory ? 'dimmed' : undefined}>
          {entry.name}
        </Text>
      </Group>

      {hasChildren && isOpen && (
        <Box pl="md">
          <FileTree entries={entry.children!} />
        </Box>
      )}
    </>
  );
};
