import type { MessageElementsTypeEnum, MessageElementsTypeKeyword } from './types';

export const BOUNCE_UPDATE_VARIABLE_VALUE = 500;

export const formatMessageElementsKeywordByEnum = {
  8: 'tag',
  3: 'date',
  4: 'time',
  7: 'pound',
  2: 'number',
  5: 'select',
  6: 'plural',
  0: 'literal',
  1: 'argument',
} as Record<MessageElementsTypeEnum, MessageElementsTypeKeyword>;

export const formatMessageElementsEnumByKeyword = {
  tag: 8,
  date: 3,
  time: 4,
  pound: 7,
  number: 2,
  select: 5,
  plural: 6,
  literal: 0,
  argument: 1,
} as Record<MessageElementsTypeKeyword, MessageElementsTypeEnum>;
