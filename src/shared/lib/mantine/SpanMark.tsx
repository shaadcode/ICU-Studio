import type { Attribute } from '@tiptap/react';
import { Mark, ReactMarkViewRenderer } from '@tiptap/react';

import SpanMarkView from './SpanMarkView/SpanMarkView';
import type { SpanDataAttrs } from '../icu/createHtml/createHtml';

const setAttribute = <
  AttrName extends SpanDataAttrs,
>(attrName: AttrName): Record<AttrName, Attribute> =>
  // @ts-expect-error
  ({
    [attrName as AttrName]: {
      default: null,
      parseHTML: (element) => {
        return element.getAttribute(attrName);
      },
      renderHTML: (attributes) => {
        return ({ class: attributes[attrName] });
      },
    } as Attribute,
  });

export const SpanMark = Mark.create({
  name: 'span',
  group: 'inline',
  renderHTML: ({ HTMLAttributes }) => ['span', HTMLAttributes, 0],
  addMarkView: () => {
    return ReactMarkViewRenderer(SpanMarkView);
  },
  addAttributes() {
    return {
      ...setAttribute('class'),
      ...setAttribute('data-reference-id'),
    } as const satisfies Record<SpanDataAttrs, Attribute>;
  },
  parseHTML: () => [
    {
      tag: 'span',
      getAttrs: (node) => {
        const result = Array
          .from(node.attributes)
          .reduce((prevAttr, currentAttr) => {
            return ({
              ...prevAttr,
              [currentAttr.name]: currentAttr.nodeValue,
            });
          }, {});

        return result;
      },
    },
  ],
});
