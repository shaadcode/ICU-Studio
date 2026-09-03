import type { LiteralUnion } from 'type-fest';
import type { TYPE, MessageFormatElement } from '@formatjs/icu-messageformat-parser';

import type { rootSpanMethods } from '../rootSpanFactory';
import type { Traverse, TraverseContext } from './createHtml';

export type ElementTypes = keyof typeof TYPE;

export type MarkAttrs = 'data-mark-type' | 'data-depends-on' | 'data-reference-id';

export type ExtendedValidPluralRule = LiteralUnion<'one' | 'two' | 'few' | 'zero' | 'many' | 'other', string>;

export type SharedToHtmlHelpersParams<ElementType extends MessageFormatElement> = {
  traverse: Traverse;
  message: ElementType;
  ctx?: TraverseContext;
  rootSpan: HTMLSpanElement;
  methods: Omit<ReturnType<typeof rootSpanMethods>, 'rootSpan'>;
};
