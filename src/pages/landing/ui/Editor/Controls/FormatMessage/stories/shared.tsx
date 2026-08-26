import { expect } from 'storybook/test';
import type { Editor } from '@tiptap/react';
import type { PlayFunction } from 'storybook/internal/csf';
import type { Decorator, ReactRenderer } from '@storybook/react-vite';

import ICUEditor from '../../../Editor';

export const createSimpleFormatMessageDecorator = (content: string): Decorator => Story => (
  <ICUEditor
    custom={{
      toolBarChildren: <Story />,
      customEditorConfig: { content },
      onMount: ({ editor }) => (window as any).__testEditor = editor,
    }}
  />
);

export const createSimpleFormatMessageTest = (message: string): PlayFunction<ReactRenderer, object> => async ({ canvas, userEvent }) => {
  const editor = (window as any)['__testEditor'] as Editor;
  await userEvent.click(await canvas.findByRole('button', { name: 'formatting message' }));

  expect(editor.getText()).toEqual(message);
};
