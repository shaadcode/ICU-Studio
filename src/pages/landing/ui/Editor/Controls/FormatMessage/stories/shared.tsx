import { expect } from 'storybook/test';
import type { Editor } from '@tiptap/react';
import type { PlayFunction } from 'storybook/internal/csf';
import type { Decorator, ReactRenderer } from '@storybook/react-vite';

import ICUEditor from '../../../Editor';

type Options = {
  withSetContent?: true;
};

export const createSimpleFormatMessageDecorator = (content: string, opts?: Options): Decorator => Story => (
  <ICUEditor
    custom={{
      toolBarChildren: <Story />,
      customEditorConfig: { content: opts?.withSetContent ? undefined : content },
      onMount: ({ editor }) => {
        (window as any).__testEditor = editor;

        if (opts?.withSetContent) {
          editor.commands.setContent(
            content,
            { emitUpdate: false, parseOptions: { preserveWhitespace: 'full' } },
          );
        }
      },
    }}
  />
);

export const createSimpleFormatMessageTest = (message: string): PlayFunction<ReactRenderer, object> => async ({ canvas, userEvent }) => {
  const editor = (window as any)['__testEditor'] as Editor;
  await userEvent.click(await canvas.findByRole('button', { name: 'formatting message' }));
  const content = editor.getText();

  await expect(content).toEqual(message);
};
