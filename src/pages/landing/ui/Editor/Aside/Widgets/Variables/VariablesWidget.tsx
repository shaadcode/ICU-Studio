import { useTranslations } from 'use-intl';
import { useSelection } from '@mantine/hooks';
import { memo, useMemo, useState, useCallback } from 'react';
import { IconVariable, IconChevronDown } from '@tabler/icons-react';
import {
  Stack,
  Group,
  Badge,
  Collapse,
  ActionIcon,
  ScrollAreaAutosize,
} from '@mantine/core';

import { VariableItem } from './VariableItem';
import WidgetHeader from '../../../WidgetHeader';
import { DeleteAllButton } from './DeleteAllButton';
import { VARIABLE_COLORS } from '@/shared/lib/mantine';
import { ConvertAllToButton } from './ConvertAllToButton';
import { VariablesEmptyState } from './VariablesEmptyState';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import WidgetContainer from '../../../WidgetContainer/WidgetContainer';
import type { MessageElementsTypeKeyword } from '@/shared/lib/icu/types';

export const VariablesWidget = memo(() => {
  const t = useTranslations('editor');
  const tCommon = useTranslations('common');
  const variables = icuEditorStore.use.variables();
  const editor = icuEditorStore.use.editorInstance();
  const isEmpty = variables.length === 0;

  const [opened, setOpened] = useState(true);

  const handleToggle = useCallback(() => {
    setOpened(prev => !prev);
  }, []);

  const referenceIds = useMemo(
    () => variables.map(v => v.referenceId),
    [variables],
  );

  const [selection, handlers] = useSelection({
    data: referenceIds,
    defaultSelection: [],
  });
  const hasSelection = selection.length > 0;

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const variable of variables) {
      result[variable.keywordType] = (result[variable.keywordType] ?? 0) + 1;
    }
    return result;
  }, [variables]);

  const totalCount = variables.length;

  return (
    <WidgetContainer
      mah={400}
      h={opened ? '100%' : 'fit-content'}
      style={{ transition: 'height 0.2s' }}
    >
      <Stack h="100%" gap="xs">
        <WidgetHeader
          label={t('widgets.variables.title')}
          icon={props => (
            <IconVariable color="var(--mantine-color-grape-6)" {...props} />
          )}
          endSection={(
            <Group gap="xs" wrap="nowrap">
              {hasSelection && editor && (
                <>
                  <ConvertAllToButton
                    editor={editor}
                    referenceIds={selection}

                    onConverted={handlers.resetSelection}
                  />
                  <DeleteAllButton
                    editor={editor}
                    referenceIds={selection}

                    onDeleted={handlers.resetSelection}
                  />
                </>
              )}

              <Badge size="sm" color="grape" variant="light">
                {totalCount}
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
            </Group>
          )}
        />

        <Collapse expanded={opened}>
          <Stack gap="xs" h="calc(400px - 52px)">
            {!isEmpty && (
              <Group gap={4} wrap="wrap">
                {Object.entries(counts).map(([keywordType, count]) => {
                  const typedKeywordType = keywordType as MessageElementsTypeKeyword;
                  const colorKey = typedKeywordType in VARIABLE_COLORS
                    ? typedKeywordType as keyof typeof VARIABLE_COLORS
                    : 'argument';
                  const { color } = VARIABLE_COLORS[colorKey];

                  return (
                    <Badge
                      size="xs"
                      color={color}
                      tt="capitalize"
                      variant="light"
                      key={typedKeywordType}
                    >
                      {t(`messageFormatEnumKeyword.${typedKeywordType}`)}
                      {': '}
                      {count}
                    </Badge>
                  );
                })}
              </Group>
            )}

            {isEmpty
              ? (
                  <VariablesEmptyState />
                )
              : (
                  <ScrollAreaAutosize mr="-xs" scrollbars="y" offsetScrollbars>
                    <Stack gap="xs">
                      {variables.map(variable => (
                        <VariableItem
                          variable={variable}
                          key={variable.referenceId}
                          hasSelection={hasSelection}
                          isSelected={selection.includes(variable.referenceId)}

                          onToggleSelect={handlers.toggle}
                          onSelect={id => handlers.toggle(id)}
                        />
                      ))}
                    </Stack>
                  </ScrollAreaAutosize>
                )}
          </Stack>
        </Collapse>
      </Stack>
    </WidgetContainer>
  );
});

VariablesWidget.displayName = 'VariablesWidget';
