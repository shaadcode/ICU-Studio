import './Marks.module.css';
import type { ValueOf } from 'type-fest';
import { useRef, useLayoutEffect } from 'react';
import type { MarkViewRendererProps } from '@tiptap/react';
import { getMarkRange, MarkViewContent } from '@tiptap/react';

import StemMark from './Elements/Stem/Stem';
import CommaMark from './Elements/Comma/Comma';
import PoundMark from './Elements/Pound/Pound';
import RawTextMark from './Elements/RawText/RawText';
import TagValueMark from './Elements/TagValue/TagValue';
import type { MarkAttrs } from '../../icu/createHtml/types';
import StemOptionMark from './Elements/StemOption/StemOption';
import { icuEditorStore } from '@/pages/landing/config/store';
import ArgumentName from './Elements/ArgumentName/ArgumentName';
import OffsetColonMark from './Elements/OffsetColon/OffsetColon';
import OffsetValueMark from './Elements/OffsetValue/OffsetValue';
import type { MARK_TYPES } from '../../icu/createHtml/createHtml';
import PluralOptionMark from './Elements/PluralOption/PluralOption';
import SelectOptionMark from './Elements/SelectOption/SelectOption';
import OffsetKeywordMark from './Elements/OffsetKeyword/OffsetKeyword';
import PluralKeywordMark from './Elements/PluralKeyword/PluralKeyword';
import SelectKeywordMark from './Elements/SelectKeyword/SelectKeyword';
import { isOpenDelimiter, isCloseDelimiter } from '../../tiptap/delimiters';
import DateArgumentNameMark from './Elements/DateArgumentName/DateArgumentName';
import LeftAngleOpenTagMark from './Elements/LeftAngleOpenTag/LeftAngleOpenTag';
import TimeArgumentNameMark from './Elements/TimeArgumentName/TimeArgumentName';
import LeftAngleCloseTagMark from './Elements/LeftAngleCloseTag/LeftAngleCloseTag';
import SkeletonSeparatorMark from './Elements/SkeletonSeparator/SkeletonSeparator';
import DedicatedFormatterMark from './Elements/DedicatedFormatter/DedicatedFormatter';
import NumberArgumentNameMark from './Elements/NumberArgumentName/NumberArgumentName';
import OptionDelimiterEndMark from './Elements/OptionDelimiterEnd/OptionDelimiterEnd';
import RightAngleCloseTagMark from './Elements/RightAngleCloseTag/RightAngleCloseTag';
import StemOptionSeparatorMark from './Elements/StemOptionSeparator/StemOptionSeparator';
import OptionDelimiterStartMark from './Elements/OptionDelimiterStart/OptionDelimiterStart';
import SelectOrdinalKeywordMark from './Elements/SelectOrdinalKeyword/SelectOrdinalKeyword';
import DateTimeSkeletonPatternMark from './Elements/DateTimeSkeletonPattern/DateTimeSkeletonPattern';
import ArgumentNameDelimiterEndMark from './Elements/ArgumentNameDelimiterEnd/ArgumentNameDelimiterEnd';
import ArgumentNameDelimiterStartMark from './Elements/ArgumentNameDelimiterStart/ArgumentNameDelimiterStart';

const customMarks = {
  'stem': StemMark,
  'comma': CommaMark,
  'pound': PoundMark,
  'raw-text': RawTextMark,
  'tag-value': TagValueMark,
  'stem-option': StemOptionMark,
  'argument-name': ArgumentName,
  'offset-value': OffsetValueMark,
  'offset-colon': OffsetColonMark,
  'plural-option': PluralOptionMark,
  'select-option': SelectOptionMark,
  'plural-keyword': PluralKeywordMark,
  'select-keyword': SelectKeywordMark,
  'offset-keyword': OffsetKeywordMark,
  'time-argument-name': TimeArgumentNameMark,
  'date-argument-name': DateArgumentNameMark,
  'left-angle-open-tag': LeftAngleOpenTagMark,
  'skeleton-separator': SkeletonSeparatorMark,
  'right-angle-open-tag': LeftAngleOpenTagMark,
  'dedicated-formatter': DedicatedFormatterMark,
  'left-angle-close-tag': LeftAngleCloseTagMark,
  'option-delimiter-end': OptionDelimiterEndMark,
  'number-argument-name': NumberArgumentNameMark,
  'right-angle-close-tag': RightAngleCloseTagMark,
  'stem-option-separator': StemOptionSeparatorMark,
  'selectOrdinal-keyword': SelectOrdinalKeywordMark,
  'option-delimiter-start': OptionDelimiterStartMark,
  'date-time-skeleton-pattern': DateTimeSkeletonPatternMark,
  'argument-name-delimiter-end': ArgumentNameDelimiterEndMark,
  'argument-name-delimiter-start': ArgumentNameDelimiterStartMark,

} as const satisfies Record<ValueOf<typeof MARK_TYPES>, any>;

type Props = MarkViewRendererProps;
const SpanMarkView = (view: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const dependsOn = view.mark.attrs['data-depends-on' as MarkAttrs];
  const markType = view.mark.attrs['data-mark-type' as MarkAttrs];

  const addDelimiterRange = icuEditorStore.use.actions().addDelimiterRange;

  const CustomMark = customMarks[markType as ValueOf<typeof MARK_TYPES>];

  useLayoutEffect(() => {
    if (ref.current) {
      const isCloseDelimiterChecked = isCloseDelimiter(markType);
      const isOpenDelimiterChecked = isOpenDelimiter(markType);

      if (isCloseDelimiterChecked || isOpenDelimiterChecked) {
        const pos = view.view.posAtDOM(ref.current, 0);
        const resolvedPos = view.editor.state.doc.resolve(pos);
        const markRange = getMarkRange(resolvedPos, view.mark.type);
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
  }, [ref.current]);

  if (CustomMark) {
    return (
      <span ref={ref}>
        {/* @ts-expect-error */}
        <CustomMark view={view}>
          <MarkViewContent />
        </CustomMark>
      </span>
    );
  }

  return (
    <MarkViewContent />
  );
};

export default SpanMarkView;
