import type { ValueOf } from 'type-fest';

import type { MARK_TYPES } from '@/shared/lib/icu/createHtml/createHtml';
import type { MarkAttributesWithoutClass } from '@/shared/lib/icu/types';

export type MarkComponentConfig = {
  withActions?: true;
  classes?: (params: ClassesParams) => string;
};
type ClassesParams = {
  markAttributes: MarkAttributesWithoutClass;
};

export const elementsConfig = {
  'stem': { classes: () => `text-(--mantine-color-blue-5) ` },
  'plural-option': { classes: () => `text-(--mantine-color-red-3)` },
  'select-option': { classes: () => `text-(--mantine-color-red-3)` },
  'offset-colon': { classes: () => `text-(--mantine-color-orange-6)` },
  'stem-option': { classes: () => `text-(--mantine-color-blue-5) !me-2` },
  'plural-keyword': { classes: () => `text-(--mantine-color-red-6) !mx-2` },
  'select-keyword': { classes: () => `text-(--mantine-color-red-6) !mx-2` },
  'left-angle-open-tag': { classes: () => `text-(--mantine-color-blue-3)` },
  'left-angle-close-tag': { classes: () => `text-(--mantine-color-blue-3)` },
  'right-angle-open-tag': { classes: () => `text-(--mantine-color-blue-3)` },
  'offset-value': { classes: () => `text-(--mantine-color-orange-9) !mx-2` },
  'right-angle-close-tag': { classes: () => `text-(--mantine-color-blue-3)` },
  'stem-option-separator': { classes: () => `text-(--mantine-color-blue-5)` },
  'offset-keyword': { classes: () => `text-(--mantine-color-orange-6) !ms-2 ` },
  'dedicated-formatter': { classes: () => `text-(--mantine-color-blue-5) !mx-2` },
  'skeleton-separator': { classes: () => `text-(--mantine-color-blue-3) !ms-2 ` },
  'option-delimiter-end': { classes: () => 'text-(--mantine-color-gray-7) !mx-2' },
  'date-time-skeleton-pattern': { classes: () => `text-(--mantine-color-blue-5)` },
  'argument-name-delimiter-end': { classes: () => 'text-(--mantine-color-gray-7)' },
  'tag-value': { withActions: true, classes: () => `text-(--mantine-color-blue-9)` },
  'option-delimiter-start': { classes: () => 'text-(--mantine-color-gray-7) !mx-2' },
  'argument-name-delimiter-start': { classes: () => 'text-(--mantine-color-gray-7)' },
  'selectOrdinal-keyword': { classes: () => `text-(--mantine-color-orange-6) !mx-2 ` },
  'date-argument-name': {
    withActions: true,
    classes: () => 'text-(--mantine-color-blue-9) !mx-2',
  },
  'time-argument-name': {
    withActions: true,
    classes: () => 'text-(--mantine-color-blue-9) !mx-2',
  },
  'number-argument-name': {
    withActions: true,
    classes: () => 'text-(--mantine-color-blue-9) !mx-2',
  },
  'pound': {
    withActions: true,
    classes: ({ markAttributes }) => {
      const depth = markAttributes['data-depth'];
      let className = '';

      className += ` text-(${getArgumentTextColorByDepth(Number(depth))})`;
      return className;
    },
  },
  'argument-name': {
    withActions: true,
    classes: ({ markAttributes }) => {
      const depth = markAttributes['data-depth'];
      let className = '!mx-2';
      className += ` ${getArgumentTextColorByDepth(Number(depth))}`;
      return className;
    },
  },
} as const satisfies {
  [Key in ValueOf<typeof MARK_TYPES>]?: MarkComponentConfig;
};

function getArgumentTextColorByDepth(depth: number) {
  const colorNum = (depth % 3 === 0 ? 1 : depth % 3 as 1 | 2 | 3);

  const argumentColor = {
    2: 'text-(--mantine-color-red-8)',
    3: 'text-(--mantine-color-blue-8)',
    1: 'text-(--mantine-color-green-8)',
  } as const;

  return argumentColor[colorNum];
}
