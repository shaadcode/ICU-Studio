import type { Editor } from '@tiptap/react';

export const extendSetContent = (editor: Editor) => (content: string) => editor.commands.setContent(content, { emitUpdate: false, parseOptions: { preserveWhitespace: 'full' } });

export const extendInsertContent = (editor: Editor) => (content: string) => editor.commands.insertContent(content, { parseOptions: { preserveWhitespace: 'full' } });
