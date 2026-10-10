import type { ValueOf } from 'type-fest';
import type { CSSProperties } from 'react';
import type { UseColorSchemeValue } from '@mantine/hooks';

import type { MARK_TYPES } from '@/shared/lib/icu/createHtml/createHtml';
import type { MarkAttributesWithoutClass } from '@/shared/lib/icu/types';

export type MarkComponentConfig = {
  withActions?: true;
  style?: (params: StyleParams) => CSSProperties;
};
type StyleParams = {
  colorScheme: UseColorSchemeValue;
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

const SHADE = {
  dark: 4,
  light: 7,
} as const;

export const makeColorValue = (
  color: string,
  colorScheme: UseColorSchemeValue,
): string => `var(--mantine-color-${color}-${SHADE[colorScheme]})`;

export const VARIABLE_COLORS = {
  date: { color: 'teal' },
  time: { color: 'cyan' },
  plural: { color: 'red' },
  tag: { color: 'indigo' },
  number: { color: 'blue' },
  pound: { color: 'orange' },
  select: { color: 'violet' },
  literal: { color: 'orange' },
  argument: { color: 'grape' },
  selectordinal: { color: 'orange' },
} as const;

export type VariableColorKey = keyof typeof VARIABLE_COLORS;

const SYNTAX_COLORS = {
  gray: 'gray',
  orange: 'orange',
} as const;

export const elementsConfig = {
  'stem': {
    style: ({ colorScheme }) => ({
      color: makeColorValue(VARIABLE_COLORS.number.color, colorScheme),
    }),
  },
  'offset-colon': {
    style: ({ colorScheme }) => ({
      color: makeColorValue(SYNTAX_COLORS.orange, colorScheme),
    }),
  },
  'left-angle-open-tag': {
    style: ({ colorScheme }) => ({
      color: makeColorValue(VARIABLE_COLORS.tag.color, colorScheme),
    }),
  },
  'left-angle-close-tag': {
    style: ({ colorScheme }) => ({
      color: makeColorValue(VARIABLE_COLORS.tag.color, colorScheme),
    }),
  },
  'right-angle-open-tag': {
    style: ({ colorScheme }) => ({
      color: makeColorValue(VARIABLE_COLORS.tag.color, colorScheme),
    }),
  },
  'right-angle-close-tag': {
    style: ({ colorScheme }) => ({
      color: makeColorValue(VARIABLE_COLORS.tag.color, colorScheme),
    }),
  },
  'argument-name-delimiter-start': {
    style: ({ colorScheme }) => ({
      color: makeColorValue(SYNTAX_COLORS.gray, colorScheme),
    }),
  },
  'stem-option-separator': {
    style: ({ colorScheme }) => ({
      color: makeColorValue(VARIABLE_COLORS.number.color, colorScheme),
    }),
  },
  'date-time-skeleton-pattern': {
    style: ({ colorScheme }) => ({
      color: makeColorValue(VARIABLE_COLORS.date.color, colorScheme),
    }),
  },
  'tag-value': {
    withActions: true,
    style: ({ colorScheme }) => ({
      color: makeColorValue(VARIABLE_COLORS.tag.color, colorScheme),
    }),
  },
  'offset-value': {
    style: ({ colorScheme }) => ({
      marginInline: H_MARGIN,
      color: makeColorValue(SYNTAX_COLORS.orange, colorScheme),
    }),
  },
  'option-delimiter-end': {
    style: ({ colorScheme }) => ({
      marginInline: H_MARGIN,
      color: makeColorValue(SYNTAX_COLORS.gray, colorScheme),
    }),
  },
  'offset-keyword': {
    style: ({ colorScheme }) => ({
      marginInlineStart: H_MARGIN,
      color: makeColorValue(SYNTAX_COLORS.orange, colorScheme),
    }),
  },
  'option-delimiter-start': {
    style: ({ colorScheme }) => ({
      marginInline: H_MARGIN,
      color: makeColorValue(SYNTAX_COLORS.gray, colorScheme),
    }),
  },
  'select-keyword': {
    style: ({ colorScheme }) => ({
      marginInline: H_MARGIN,
      color: makeColorValue(VARIABLE_COLORS.select.color, colorScheme),
    }),
  },
  'plural-keyword': {
    style: ({ colorScheme }) => ({
      marginInline: H_MARGIN,
      color: makeColorValue(VARIABLE_COLORS.plural.color, colorScheme),
    }),
  },
  'stem-option': {
    style: ({ colorScheme }) => ({
      marginInlineEnd: H_MARGIN,
      color: makeColorValue(VARIABLE_COLORS.number.color, colorScheme),
    }),
  },
  'dedicated-formatter': {
    style: ({ colorScheme }) => ({
      marginInline: H_MARGIN,
      color: makeColorValue(VARIABLE_COLORS.number.color, colorScheme),
    }),
  },
  'skeleton-separator': {
    style: ({ colorScheme }) => ({
      marginInlineStart: H_MARGIN,
      color: makeColorValue(VARIABLE_COLORS.date.color, colorScheme),
    }),
  },
  'selectOrdinal-keyword': {
    style: ({ colorScheme }) => ({
      marginInline: H_MARGIN,
      color: makeColorValue(VARIABLE_COLORS.selectordinal.color, colorScheme),
    }),
  },
  'pound': {
    withActions: true,
    style: ({ colorScheme }) => ({
      marginInline: H_MARGIN,
      color: makeColorValue(VARIABLE_COLORS.plural.color, colorScheme),
    }),
  },
  'argument-name': {
    withActions: true,
    style: ({ colorScheme }) => ({
      marginInline: H_MARGIN,
      color: makeColorValue(VARIABLE_COLORS.argument.color, colorScheme),
    }),
  },
  'date-argument-name': {
    withActions: true,
    style: ({ colorScheme }) => ({
      marginInline: H_MARGIN,
      color: makeColorValue(VARIABLE_COLORS.date.color, colorScheme),
    }),
  },
  'time-argument-name': {
    withActions: true,
    style: ({ colorScheme }) => ({
      marginInline: H_MARGIN,
      color: makeColorValue(VARIABLE_COLORS.time.color, colorScheme),
    }),
  },
  'number-argument-name': {
    withActions: true,
    style: ({ colorScheme }) => ({
      marginInline: H_MARGIN,
      color: makeColorValue(VARIABLE_COLORS.number.color, colorScheme),
    }),
  },
  'plural-option': {
    style: ({ colorScheme, markAttributes }) => {
      const depth = Number(markAttributes['data-depth']);
      return {
        marginInlineStart: `${depth * INDENT_PER_DEPTH}px`,
        color: makeColorValue(VARIABLE_COLORS.plural.color, colorScheme),
      };
    },
  },
  'select-option': {
    style: ({ colorScheme, markAttributes }) => {
      const depth = Number(markAttributes['data-depth']);
      return {
        marginInlineStart: `${depth * INDENT_PER_DEPTH}px`,
        color: makeColorValue(VARIABLE_COLORS.select.color, colorScheme),
      };
    },
  },
  'argument-name-delimiter-end': {
    style: ({ colorScheme, markAttributes }) => {
      const depth = Number(markAttributes['data-depth']);
      return {
        marginInlineStart: `${depth * INDENT_PER_DEPTH}px`,
        color: makeColorValue(SYNTAX_COLORS.gray, colorScheme),
      };
    },
  },
} as const satisfies {
  [Key in ValueOf<typeof MARK_TYPES>]?: MarkComponentConfig;
};
