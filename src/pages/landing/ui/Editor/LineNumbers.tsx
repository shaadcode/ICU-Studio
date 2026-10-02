import { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { Box, Text, Center } from '@mantine/core';
import { useRichTextEditorContext } from '@mantine/tiptap';

type Props = {
  editor: Editor;
};
const LineNumbers = (props: Props) => {
  const { editor } = useRichTextEditorContext();

  const [hardBreaksLength, setHardBreaksLength] = useState(0);

  function getHardBreaksLength(editor: Editor) {
    let count = 0;

    editor.state.doc.descendants((node) => {
      if (node.type.name === 'hardBreak') {
        count++;
      }
    });
    return count;
  }

  useEffect(() => {
    props.editor.on(
      'update',
      ({ editor }) => setHardBreaksLength(getHardBreaksLength(editor)),
    );
    props.editor.on(
      'mount',
      ({ editor }) => setHardBreaksLength(getHardBreaksLength(editor)),
    );
    props.editor.on(
      'paste',
      ({ editor }) => setHardBreaksLength(getHardBreaksLength(editor)),
    );
  }, [editor]);

  const numbers = Array
    .from({ length: hardBreaksLength + 1 })
    .map((_, i) => (
      <Center
        h={25}
        key={i}

      >
        <Text
          m={0}
          fz="xs"
          c="gray.5"
          style={{
            userSelect: 'none',
          }}
        >
          {i + 1}
        </Text>
      </Center>
    ));
  return (
    <Box
      w={22}
      py={19}
      top={0}
      h="100%"
      left={0}
      bg="gray.0"
      pos="absolute"
      style={{
        gap: '2px',
        display: 'grid',
        alignContent: 'start',
        gridTemplateColumns: 1,
        justifyContent: 'center',
      }}
    >
      {numbers}
    </Box>
  );
};

export default LineNumbers;
