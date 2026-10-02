import { HardBreak } from '@tiptap/extension-hard-break';

export const CustomHardBreak = HardBreak.extend({
  addKeyboardShortcuts() {
    return {
      'Enter': () => this.editor.chain().setHardBreak().run(),

      'Shift-Enter': () => this.editor.chain().setHardBreak().run(),
    };
  },
});
