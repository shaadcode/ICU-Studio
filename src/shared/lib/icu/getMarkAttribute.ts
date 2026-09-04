import type { MarkViewRendererProps } from '@tiptap/react';

import type { MarkAttributes } from './types';

/**
 * without class name
 */
export function getMarkAttributes(tiptapMark: MarkViewRendererProps) {
  const { class: className, ...otherAttrs } = tiptapMark.mark.attrs as MarkAttributes;

  return otherAttrs;
};
