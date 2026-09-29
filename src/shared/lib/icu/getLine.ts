import type { Editor } from '@tiptap/react';

export const getLineRange = (editor: Editor, line: number): { end: number; start: number } => {
  const nodes = editor.$node('paragraph')?.children;
  const hardBreaks = nodes
    ?.filter(node => node
      // @ts-expect-error
      .currentNode
      .type
      .name === 'hardBreak');
  const startNode = hardBreaks?.[line - 2];
  const endNode = hardBreaks?.[line - 1];
  if (!startNode || !endNode) {
    throw new Error('node is undefined(getLine function)');
  }

  return {
    end: endNode.pos,
    start: startNode.pos + 1,
  };
};
