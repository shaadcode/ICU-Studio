import type { ValueOf } from 'type-fest';
import { getMarkRange } from '@tiptap/react';
import type { MarkViewRendererProps } from '@tiptap/react';

import type { MarkAttrs } from '../icu/createHtml/types';
import type { MARK_TYPES } from '../icu/createHtml/createHtml';

export const isOpenDelimiter = (markType: ValueOf<typeof MARK_TYPES>) => markType === 'argument-name-delimiter-start'
  || markType === 'left-angle-open-tag';

export const isCloseDelimiter = (markType: ValueOf<typeof MARK_TYPES>) => markType === 'argument-name-delimiter-end'
  || markType === 'right-angle-close-tag';

export const getOpenDelimiter = (view: MarkViewRendererProps) => {
  const { mark, editor } = view;
  const markType = mark.attrs['data-mark-type' as MarkAttrs] as ValueOf<typeof MARK_TYPES>;
  if (isOpenDelimiter(markType)) {
    return { open: getMarkRange(editor.state.selection.$from, mark.type) ?? undefined };
  }

  return {};
};

export const getCloseDelimiter = (view: MarkViewRendererProps) => {
  const { mark, editor } = view;
  const markType = mark.attrs['data-mark-type' as MarkAttrs] as ValueOf<typeof MARK_TYPES>;
  if (isCloseDelimiter(markType)) {
    return { close: getMarkRange(editor.state.selection.$from, mark.type) ?? undefined };
  }
  return {};
};
