import ICUEditor from '../../Editor/Editor';
import { useMessageMainSectionHandlers } from './useMessageMainSectionHandlers';

const MessagesMainSection = () => {
  const handlers = useMessageMainSectionHandlers();

  return (
    <ICUEditor editor={handlers.editor} />
  );
};

export default MessagesMainSection;
