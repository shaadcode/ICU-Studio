import type { Editor } from '@tiptap/react';

type Params = {
  editor: Editor;
};

export const extendSetContent = ({ editor }: Params) => (content: string) =>
  editor
    .chain()
    .setContent(
      content,
      { emitUpdate: false, parseOptions: { preserveWhitespace: 'full' } },
    )
    .run();

export const extendInsertContent = (editor: Editor) => (content: string) => editor.commands.insertContent(content, { parseOptions: { preserveWhitespace: 'full' } });
