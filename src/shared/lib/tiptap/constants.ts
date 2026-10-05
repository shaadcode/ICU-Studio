import type { EditorOptions } from '@tiptap/react';
import { Placeholder } from '@tiptap/extension-placeholder';

import { SpanMark } from '../mantine';
import { CustomHardBreak } from './customHardBreak';
import { StarterKitForICUEditor } from './starterKitIcu';

type Params = {
  placeholder: string;
};

export const defaultICUEditorConfig = (params: Params) => ({
  parseOptions: { preserveWhitespace: 'full' },
  extensions: [
    StarterKitForICUEditor,
    Placeholder.configure({ placeholder: params.placeholder }),
    SpanMark,
    CustomHardBreak,
  ],
} as EditorOptions);
