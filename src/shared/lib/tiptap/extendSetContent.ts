import type { Editor } from '@tiptap/react';

export const extendSetContent = (editor: Editor) => (content: string) => editor.commands.setContent(content, { emitUpdate: false, parseOptions: { preserveWhitespace: 'full' } });
