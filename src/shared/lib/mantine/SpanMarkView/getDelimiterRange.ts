import type { Range, Editor } from '@tiptap/react';

import { getMarkAttributes } from '../../icu';
import { isOpenDelimiter, isCloseDelimiter } from '../../tiptap/delimiters';

type Params = {
  editor: Editor;
  referenceId: string;
};
export const getDelimiterRange = (params: Params) => {
  const delimitersRange = {} as Record<'open' | 'close', Range>;

  params.editor.state.doc.descendants((node, pos) => {
    if (node.marks[0]?.attrs['data-depends-on'] === params.referenceId) {
      const markAttrs = getMarkAttributes(node.marks[0]);

      if (isCloseDelimiter(markAttrs['data-mark-type'])) {
        delimitersRange.close = { from: pos, to: pos + node.nodeSize };
      }

      if (isOpenDelimiter(markAttrs['data-mark-type'])) {
        delimitersRange.open = { from: pos, to: pos + node.nodeSize };
      }
    }
  });

  return delimitersRange;
};
