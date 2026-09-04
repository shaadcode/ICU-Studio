import type React from 'react';
import { getMarkRange } from '@tiptap/react';
import type { MarkViewRendererProps } from '@tiptap/react';

import type { MarkAttrs } from '../../icu/createHtml/types';
import type { ICUEditorStore } from '@/pages/landing/config/store';
import { isOpenDelimiter, isCloseDelimiter } from '../../tiptap/delimiters';

type Params = {
  tiptapMark: MarkViewRendererProps;
  ref: React.RefObject<HTMLSpanElement>;
  addDelimiterRange: ICUEditorStore['actions']['addDelimiterRange'];
};
export function getDelimiterRange(params: Params) {
  const { ref, tiptapMark, addDelimiterRange } = params;
  const dependsOn = tiptapMark.mark.attrs['data-depends-on' as MarkAttrs];
  const markType = tiptapMark.mark.attrs['data-mark-type' as MarkAttrs];

  const isCloseDelimiterChecked = isCloseDelimiter(markType);
  const isOpenDelimiterChecked = isOpenDelimiter(markType);
  if (isCloseDelimiterChecked || isOpenDelimiterChecked) {
    const pos = tiptapMark.view.posAtDOM(ref.current, 0);
    const resolvedPos = tiptapMark.editor.state.doc.resolve(pos);
    const markRange = getMarkRange(resolvedPos, tiptapMark.mark.type);
    if (isCloseDelimiterChecked) {
      addDelimiterRange(dependsOn, {
        type: markType,
        close: markRange ?? undefined,
      });
    }

    if (isOpenDelimiterChecked) {
      addDelimiterRange(dependsOn, {
        type: markType,
        open: markRange ?? undefined,
      });
    }
  }
}
