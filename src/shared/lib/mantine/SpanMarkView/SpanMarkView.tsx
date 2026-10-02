import { MarkViewContent } from '@tiptap/react';
import type { MarkViewRendererProps } from '@tiptap/react';

import MarkRenderer from './MarkRenderer/MarkRenderer';

type Props = MarkViewRendererProps;
const SpanMarkView = (tiptapMark: Props) => {
  return (
    <MarkRenderer tiptapMark={tiptapMark}>
      <MarkViewContent />
    </MarkRenderer>
  );
};

export default SpanMarkView;
