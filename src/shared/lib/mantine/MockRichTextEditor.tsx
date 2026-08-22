import type { ReactNode } from 'react';
import { useEditor } from '@tiptap/react';
import { RichTextEditor } from '@mantine/tiptap';
import { StarterKit } from '@tiptap/starter-kit';

type Props = {
  control: ReactNode;
};
const MockRichTextEditor = ({ control }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: 'this example text',
  });
  return (
    <RichTextEditor w="100%" editor={editor}>
      <RichTextEditor.Toolbar>
        {control}
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default MockRichTextEditor;
