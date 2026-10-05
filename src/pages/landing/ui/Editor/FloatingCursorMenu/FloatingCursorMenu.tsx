import { Paper } from '@mantine/core';
import type { Editor } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { useHotkeys, useDisclosure } from '@mantine/hooks';

type Props = {
  editor: null | Editor;
};

type Coords = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

const FloatingCursorMenu = ({ editor }: Props) => {
  const [opened, handlers] = useDisclosure(false);
  const [coords, setCoords] = useState<null | Coords>(null);

  const updateCoords = (editor: Editor) => {
    const { from } = editor.state.selection;
    const c = editor.view.coordsAtPos(from);

    setCoords(c);
  };

  useHotkeys(
    [
      [
        'mod + space',
        (event) => {
          event.preventDefault();
          if (editor?.isFocused) {
            updateCoords(editor);
            handlers.open();
          }
        },
      ],
    ],
    [],
    true,
  );

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.on('update', handlers.close);
    editor.on('selectionUpdate', handlers.close);

    return () => {
      editor.off('update', handlers.close);
      editor.off('selectionUpdate', handlers.close);
    };
  }, [editor, handlers]);

  if (!editor || !opened || !coords) {
    return null;
  }

  return (
    <Paper
      style={{
        zIndex: 1000,
        top: coords.top,
        position: 'absolute',
        pointerEvents: 'none',
        left: coords.left - 39,
        backgroundColor: 'red',
      }}
    >

    </Paper>
  );
};

export default FloatingCursorMenu;
