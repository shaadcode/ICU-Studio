import { useRef, useLayoutEffect } from 'react';
import { MarkViewContent } from '@tiptap/react';
import type { MarkViewRendererProps } from '@tiptap/react';

import MarkRenderer from './MarkRenderer/MarkRenderer';
import { getDelimiterRange } from './getDelimiterRange';
import { icuEditorStore } from '@/pages/landing/config/store';

type Props = MarkViewRendererProps;
const SpanMarkView = (tiptapMark: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const addDelimiterRange = icuEditorStore.use.actions().addDelimiterRange;

  useLayoutEffect(() => {
    if (ref.current) {
      getDelimiterRange({
        // @ts-expect-error
        ref,
        tiptapMark,
        addDelimiterRange,
      });
    }
  }, [ref.current]);

  return (
    <span ref={ref}>
      <MarkRenderer tiptapMark={tiptapMark}>
        <MarkViewContent />
      </MarkRenderer>
    </span>
  );
};

export default SpanMarkView;
