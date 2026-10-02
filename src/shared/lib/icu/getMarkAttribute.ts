import type { Mark } from '@tiptap/pm/model';
import type { MarkViewRendererProps } from '@tiptap/react';

import type { MarkAttributes } from './types';

/**
 * without class name
 */
export function getMarkAttributes(mark: Mark) {
  const { class: className, ...otherAttrs } = mark.attrs as MarkAttributes;

  return otherAttrs;
};

/**
 * without class name
 */
export function getMarkViewAttributes(tiptapMark: MarkViewRendererProps) {
  const { class: className, ...otherAttrs } = tiptapMark.mark.attrs as MarkAttributes;

  return otherAttrs;
};
