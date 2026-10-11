import { TYPE } from '@formatjs/icu-messageformat-parser';
import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';

export type OutlineNode = {
  id: string;
  type: string;
  label: string;
  depth: number;
  children: OutlineNode[];
  location?: { end: number; start: number };
};

let nodeCounter = 0;

const createNode = (): string => {
  nodeCounter += 1;
  return `outline-${nodeCounter}`;
};

export function buildOutlineTree(
  elements: MessageFormatElement[],
  rawMessage: string,
): OutlineNode[] {
  nodeCounter = 0;
  return elements.map((element, index) =>
    buildNode(element, 0, String(index), rawMessage),
  );
}

function buildNode(
  element: MessageFormatElement,
  depth: number,
  path: string,
  rawMessage: string,
): OutlineNode {
  const id = createNode();

  switch (element.type) {
    case TYPE.literal: {
      const value = element.value.trim();
      const truncated = value.length > 40 ? `${value.slice(0, 40)}…` : value;
      return {
        id,
        depth,
        children: [],
        type: 'literal',
        label: truncated || '(empty)',
      };
    }

    case TYPE.argument: {
      return {
        id,
        depth,
        children: [],
        type: 'argument',
        label: `{${element.value}}`,
      };
    }

    case TYPE.number:
    case TYPE.date:
    case TYPE.time: {
      const type = element.type === TYPE.number
        ? 'number'
        : element.type === TYPE.date
          ? 'date'
          : 'time';
      return {
        id,
        type,
        depth,
        children: [],
        label: `{${element.value}, ${type}}`,
      };
    }

    case TYPE.plural: {
      const type = element.type === TYPE.plural ? 'plural' : 'selectordinal';
      const children = Object.entries(element.options).map(([option, opt]) => {
        const childId = createNode();
        return {
          id: childId,
          label: option,
          depth: depth + 1,
          type: `${type}-option`,
          children: opt.value
            ? opt.value.map((v, i) =>
                buildNode(v, depth + 2, `${path}.${option}.${i}`, rawMessage),
              )
            : [],
        };
      });

      return {
        id,
        type,
        depth,
        children,
        label: `{${element.value}, ${type}}`,
      };
    }

    case TYPE.select: {
      const children = Object.entries(element.options).map(([option, opt]) => {
        const childId = createNode();
        return {
          id: childId,
          label: option,
          depth: depth + 1,
          type: 'select-option',
          children: opt.value
            ? opt.value.map((v, i) =>
                buildNode(v, depth + 2, `${path}.${option}.${i}`, rawMessage),
              )
            : [],
        };
      });

      return {
        id,
        depth,
        children,
        type: 'select',
        label: `{${element.value}, select}`,
      };
    }

    case TYPE.tag: {
      const children = element.children
        ? element.children.map((child, i) =>
            buildNode(child, depth + 1, `${path}.tag.${i}`, rawMessage),
          )
        : [];

      return {
        id,
        depth,
        children,
        type: 'tag',
        label: `<${element.value}>`,
      };
    }

    case TYPE.pound: {
      return {
        id,
        depth,
        label: '#',
        children: [],
        type: 'pound',
      };
    }

    default: {
      return {
        id,
        depth,
        children: [],
        type: 'unknown',
        label: '(unknown)',
      };
    }
  }
}
