import { AppShell } from '@mantine/core';

import ICUEditor from './Editor';
import Header from '../Projects/Header/Header';

const EditorView = () => {
  return (
    <AppShell
      padding="md"
      header={{ height: 60, collapsed: false }}
    >
      <AppShell.Header p="md">
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <ICUEditor />
      </AppShell.Main>
    </AppShell>
  );
}
;

export default EditorView;
