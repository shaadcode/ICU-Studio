import type { Editor } from '@tiptap/react';

export const getLineRangeOffsetByOneLine = (editor: Editor, line: number): undefined | { end: number; start: number } => {
  const rootNode = editor.$node('paragraph');
  const hardBreaks = rootNode?.children
    ?.filter(node => node
    // @ts-expect-error
      ?.currentNode
      ?.type
      ?.name === 'hardBreak');

  const startNode = hardBreaks?.[Math.max(line - 2, 0)];
  const endNode = hardBreaks?.[Math.max(line - 1, 0)];
  if (startNode) {
    const $pos = rootNode!.node.resolve(startNode.pos);
    const parentIndex = $pos.index(0);
    return {
      start: rootNode!.children[parentIndex]!.pos - 1,
      end: endNode ? endNode.pos : rootNode!.lastChild!.to,
    };
  }

  return {
    end: rootNode!.to,
    start: rootNode!.from,
  };
};

export const getLineRangeOffset = (editor: Editor, line: number): number | undefined => {
  const nodeIndex = Math.max(line - 2, 0);

  if (nodeIndex === 0) {
    return 1;
  }

  const nodes = editor.$node('paragraph')?.children;
  const hardBreaks = nodes
    ?.filter(node => node
      // @ts-expect-error
      ?.currentNode
      ?.type
      ?.name === 'hardBreak');

  const node = hardBreaks?.[nodeIndex];
  if (!node) {
    return undefined;
  }

  return node.pos;
};
