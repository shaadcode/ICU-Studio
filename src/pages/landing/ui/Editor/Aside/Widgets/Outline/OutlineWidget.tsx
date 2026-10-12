import { useTranslations } from 'use-intl';
// OutlineWidget.tsx
import { memo, useState, useCallback } from 'react';
import { IconListTree, IconChevronDown } from '@tabler/icons-react';
import {
  Tree,
  Stack,
  Badge,
  Group,
  useTree,
  Collapse,
  ActionIcon,
  ScrollAreaAutosize,
} from '@mantine/core';

import { OutlineNode } from './OutlineNode';
import WidgetHeader from '../../../WidgetHeader';
import { OutlineEmptyState } from './OutlineEmptyState';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import WidgetContainer from '../../../WidgetContainer/WidgetContainer';

export const OutlineWidget = memo(() => {
  const tree = useTree();
  const t = useTranslations('editor');
  const tCommon = useTranslations('common');
  const treeData = icuEditorStore.use.treeData();

  const [opened, setOpened] = useState(true);

  const handleToggle = useCallback(() => {
    setOpened(prev => !prev);
  }, []);

  const isEmpty = treeData.length === 0;

  return (
    <WidgetContainer h={opened ? 460 : 'auto'} style={{ transition: 'height 0.2s' }}>
      <Stack h="100%" gap="xs">
        <WidgetHeader
          label={t('widgets.outline.title')}
          icon={props => (
            <IconListTree color="var(--mantine-color-teal-6)" {...props} />
          )}
          endSection={(
            <Group gap="xs" wrap="nowrap">
              <Badge size="sm" color="teal" variant="light">
                {treeData.length}
              </Badge>

              <ActionIcon
                size="sm"
                color="gray"
                variant="subtle"
                aria-label={opened ? tCommon('collapse') : tCommon('expand')}

                onClick={handleToggle}
              >
                <IconChevronDown
                  size={16}
                  style={{
                    transition: 'transform 0.2s',
                    transform: opened ? 'rotate(0deg)' : 'rotate(90deg)',
                  }}
                />
              </ActionIcon>
              {' '}

            </Group>
          )}
        />

        <Collapse expanded={opened}>
          {isEmpty
            ? (
                <OutlineEmptyState />
              )
            : (
                <ScrollAreaAutosize mih={0} mah={400} offsetScrollbars>
                  <Tree
                    withLines
                    tree={tree}
                    selectOnClick
                    data={treeData}
                    clearSelectionOnOutsideClick
                    renderNode={payload => <OutlineNode {...payload} />}
                  />
                </ScrollAreaAutosize>
              )}
        </Collapse>
      </Stack>
    </WidgetContainer>
  );
});

OutlineWidget.displayName = 'OutlineWidget';
