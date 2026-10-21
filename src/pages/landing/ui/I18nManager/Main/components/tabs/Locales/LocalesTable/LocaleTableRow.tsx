// components/tabs/Structure/LocaleRow.tsx
import { memo } from 'react';
import { useTranslations } from 'use-intl';
import type { TLanguageCode } from 'countries-list';
import { IconPinFilled } from '@tabler/icons-react';
import { CountryFlagRounded } from '@appica/country-flags-react';
import { Text, Table, Group, Badge, Stack, Progress, Checkbox } from '@mantine/core';

import { LocaleRowMenu } from './LocaleRowMenu';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { ProjectAnalysisResult } from '@/pages/landing/model/patterns/types';

type Props = {
  isBase: boolean;
  isActive?: boolean;
  isSelected: boolean;
  onClick?: () => void;
  isPinnedBaseLocale: boolean;
  analysis: ProjectAnalysisResult;
  onToggleSelect: (code: TLanguageCode) => void;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
  locale: NonNullable<I18nManagerStore['selectedProjectData']>['locales'][number];
};

export const LocaleRow = memo(({
  locale,
  isBase,
  onClick,
  analysis,
  isActive,
  isSelected,
  projectData,
  onToggleSelect,
  isPinnedBaseLocale,
}: Props) => {
  const t = useTranslations('i18nManager');
  const localeAnalysis = analysis.locales[locale.language.code];
  const completion = localeAnalysis?.completionPercentage ?? 0;
  const isComplete = completion === 100;
  const progressColor = completion > 80 ? 'teal' : completion > 50 ? 'yellow' : 'red';

  return (
    <Table.Tr
      style={{
        cursor: 'pointer',
        backgroundColor: isActive ? 'var(--mantine-color-gray-light)' : undefined,
      }}

      onClick={onClick}
    >
      <Table.Td>
        <Checkbox
          checked={isSelected}

          onClick={e => e.stopPropagation()}
          onChange={() => onToggleSelect(locale.language.code)}
        />
      </Table.Td>

      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          {isBase && isPinnedBaseLocale && <IconPinFilled size={14} color="var(--mantine-color-yellow-6)" />}
          <CountryFlagRounded size={20} code={locale.region || 'un'} />
          <Stack gap={0}>
            <Text fw={500} size="sm">{locale.language.code}</Text>
            <Text size="xs" c="dimmed">{locale.native}</Text>
          </Stack>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text size="sm">{locale.native}</Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm" c="dimmed">{locale.region || '-'}</Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm">{analysis.totalNamespaces}</Text>
      </Table.Td>

      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          <Progress
            size="sm"
            radius="xl"
            value={completion}
            color={progressColor}
            style={{ flex: 1, minWidth: 60 }}
          />
          <Text fw={500} size="xs">
            {completion}
            {'%\r'}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        {isBase
          ? (
              <Badge size="sm" color="blue" variant="light">
                {t('localesTab.status.default')}
              </Badge>
            )
          : (
              <Badge size="sm" variant="light" color={isComplete ? 'teal' : 'gray'}>
                {isComplete ? t('localesTab.status.active') : t('localesTab.status.incomplete')}
              </Badge>
            )}
      </Table.Td>

      <Table.Td>
        <LocaleRowMenu locale={locale} projectData={projectData} />
      </Table.Td>
    </Table.Tr>
  );
});

LocaleRow.displayName = 'LocaleRow';
