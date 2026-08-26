import { isObject } from 'es-toolkit/compat';
import type { DateElement, NumberElement, NumberSkeleton, DateTimeSkeleton } from '@formatjs/icu-messageformat-parser';

export const isRichNumberSkeleton = (style: NumberElement['style']): style is NumberSkeleton => isObject(style);

export const isSimpleNumberSkeleton = (style: NumberElement['style']): style is string => typeof style === 'string';

export const isRichDateTimeSkeleton = (style: DateElement['style']): style is DateTimeSkeleton => isObject(style);

export const isSimpleDateTimeSkeleton = (style: DateElement['style']): style is string => typeof style === 'string';
