import { MarkViewContent } from '@tiptap/react';
import type { MarkViewRendererProps } from '@tiptap/react';

import './Marks.module.css';

type Props = MarkViewRendererProps;
const SpanMarkView = (props: Props) => {
  const { class: className, ...otherAttrs } = props.mark.attrs;
  return (
    <MarkViewContent className={className} {...otherAttrs} />
  );
};

export default SpanMarkView;
