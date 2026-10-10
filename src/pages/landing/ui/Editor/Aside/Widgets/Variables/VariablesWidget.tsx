// Widgets/Variables/VariablesWidget.tsx
import { memo, useMemo } from 'react';
import { useTranslations } from 'use-intl';
import { IconVariable } from '@tabler/icons-react';
import { Stack, Group, Badge } from '@mantine/core';

import { VariableItem } from './VariableItem';
import WidgetHeader from '../../../WidgetHeader';
import { VARIABLE_COLORS } from '@/shared/lib/mantine';
import { VariablesEmptyState } from './VariablesEmptyState';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import WidgetContainer from '../../../WidgetContainer/WidgetContainer';
import type { MessageElementsTypeKeyword } from '@/shared/lib/icu/types';

export const VariablesWidget = memo(() => {
  const t = useTranslations('editor');
  const variables = icuEditorStore.use.variables();

  const isEmpty = variables.length === 0;

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const variable of variables) {
      result[variable.keywordType] = (result[variable.keywordType] ?? 0) + 1;
    }
    return result;
  }, [variables]);

  const totalCount = variables.length;

  return (
    <WidgetContainer>
      <Stack h="100%" gap="xs">
        <WidgetHeader
          label={t('widgets.variables.title')}
          icon={props => (
            <IconVariable color="var(--mantine-color-grape-6)" {...props} />
          )}
          endSection={(
            <Badge size="sm" color="grape" variant="light">
              {totalCount}
            </Badge>
          )}
        />

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
              <Stack gap="xs">
                {variables.map(variable => (
                  <VariableItem key={variable.name} variable={variable} />
                ))}
              </Stack>
            )}
      </Stack>
    </WidgetContainer>
  );
});

VariablesWidget.displayName = 'VariablesWidget';
