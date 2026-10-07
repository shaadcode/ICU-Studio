import type { ValueOf } from 'type-fest';
import type { CSSProperties } from 'react';

import type { MARK_TYPES } from '@/shared/lib/icu/createHtml/createHtml';
import type { MarkAttributesWithoutClass } from '@/shared/lib/icu/types';

export type MarkComponentConfig = {
  withActions?: true;
  style?: (params: StyleParams) => CSSProperties;
};
type StyleParams = {
  markAttributes: MarkAttributesWithoutClass;
};

const SPACING = {
  lg: '0.5rem',
  sm: '0.25rem',
  xs: '0.125rem',
  md: '0.375rem',
} as const;

const H_MARGIN = SPACING.sm;

const INDENT_PER_DEPTH = 16;

export const elementsConfig = {
  'stem': {
    style: () => ({ color: 'var(--mantine-color-blue-5)' }),
  },
  'offset-colon': {
    style: () => ({ color: 'var(--mantine-color-orange-6)' }),
  },
  'left-angle-open-tag': {
    style: () => ({ color: 'var(--mantine-color-blue-3)' }),
  },
  'left-angle-close-tag': {
    style: () => ({ color: 'var(--mantine-color-blue-3)' }),
  },
  'right-angle-open-tag': {
    style: () => ({ color: 'var(--mantine-color-blue-3)' }),
  },
  'right-angle-close-tag': {
    style: () => ({ color: 'var(--mantine-color-blue-3)' }),
  },
  'stem-option-separator': {
    style: () => ({ color: 'var(--mantine-color-blue-5)' }),
  },
  'date-time-skeleton-pattern': {
    style: () => ({ color: 'var(--mantine-color-blue-5)' }),
  },
  'tag-value': {
    withActions: true,
    style: () => ({ color: 'var(--mantine-color-blue-9)' }),
  },
  'argument-name-delimiter-start': {
    style: () => {
      return ({ color: 'var(--mantine-color-gray-7)' });
    },
  },
  'select-keyword': {
    style: () => ({
      marginInline: H_MARGIN,
      color: 'var(--mantine-color-red-6)',
    }),
  },
  'plural-keyword': {
    style: () => ({
      marginInline: H_MARGIN,
      color: 'var(--mantine-color-red-6)',
    }),
  },
  'offset-value': {
    style: () => ({
      marginInline: H_MARGIN,
      color: 'var(--mantine-color-orange-9)',
    }),
  },
  'stem-option': {
    style: () => ({
      marginInlineEnd: H_MARGIN,
      color: 'var(--mantine-color-blue-5)',
    }),
  },
  'dedicated-formatter': {
    style: () => ({
      marginInline: H_MARGIN,
      color: 'var(--mantine-color-blue-5)',
    }),
  },
  'option-delimiter-end': {
    style: () => ({
      marginInline: H_MARGIN,
      color: 'var(--mantine-color-gray-7)',
    }),
  },
  'offset-keyword': {
    style: () => ({
      marginInlineStart: H_MARGIN,
      color: 'var(--mantine-color-orange-6)',
    }),
  },
  'option-delimiter-start': {
    style: () => ({
      marginInline: H_MARGIN,
      color: 'var(--mantine-color-gray-7)',
    }),
  },
  'skeleton-separator': {
    style: () => ({
      marginInlineStart: H_MARGIN,
      color: 'var(--mantine-color-blue-3)',
    }),
  },
  'selectOrdinal-keyword': {
    style: () => ({
      marginInline: H_MARGIN,
      color: 'var(--mantine-color-orange-6)',
    }),
  },
  'date-argument-name': {
    withActions: true,
    style: () => ({
      marginInline: H_MARGIN,
      color: 'var(--mantine-color-blue-6)',
    }),
  },
  'time-argument-name': {
    withActions: true,
    style: () => ({
      marginInline: H_MARGIN,
      color: 'var(--mantine-color-blue-6)',
    }),
  },
  'number-argument-name': {
    withActions: true,
    style: () => ({
      marginInline: H_MARGIN,
      color: 'var(--mantine-color-blue-4)',
    }),
  },
  'pound': {
    withActions: true,
    style: ({ markAttributes }) => {
      const depth = Number(markAttributes['data-depth']);
      return {
        marginInline: H_MARGIN,
        color: getArgumentTextColorByDepth(depth),
      };
    },
  },
  'plural-option': {
    style: ({ markAttributes }) => {
      const depth = Number(markAttributes['data-depth']);
      return {
        color: 'var(--mantine-color-red-3)',
        marginInlineStart: `${depth * INDENT_PER_DEPTH}px`,
      };
    },
  },
  'argument-name': {
    withActions: true,
    style: ({ markAttributes }) => {
      const depth = Number(markAttributes['data-depth']);
      return {
        marginInline: H_MARGIN,
        color: getArgumentTextColorByDepth(depth),
      };
    },
  },
  'select-option': {
    style: ({ markAttributes }) => {
      const depth = Number(markAttributes['data-depth']);

      return {
        color: 'var(--mantine-color-red-3)',
        marginInlineStart: `${depth * INDENT_PER_DEPTH}px`,
      };
    },
  },
  'argument-name-delimiter-end': {
    style: ({ markAttributes }) => {
      const depth = Number(markAttributes['data-depth']);

      return {
        color: 'var(--mantine-color-gray-7)',
        marginInlineStart: `${depth * INDENT_PER_DEPTH}px`,
      };
    },
  },
} as const satisfies {
  [Key in ValueOf<typeof MARK_TYPES>]?: MarkComponentConfig;
};

function getArgumentTextColorByDepth(depth: number): string {
  const colorNum = (depth % 3 === 0 ? 1 : depth % 3) as 1 | 2 | 3;

  const argumentColor = {
    2: 'var(--mantine-color-red-8)',
    3: 'var(--mantine-color-blue-8)',
    1: 'var(--mantine-color-green-8)',
  } as const;

  return argumentColor[colorNum];
}
