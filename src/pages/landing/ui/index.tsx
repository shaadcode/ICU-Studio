import { AppShell } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';

import Navbar from './Navbar';
import Header from './Header/Header';
import ICUEditor from './Editor/Editor';
import ProjectsView from './Projects/View';
import { appStore } from '../config/store/app';
import MessagesMainSection from './Messages/Main/MainSection';

const LandingPage = () => {
  const view = appStore.use.view();
  const opened = appStore.use.opened();
  const toggle = appStore.use.actions().toggle;
  useHotkeys(
    [
      ['mod + b', toggle],
    ],
    [],
    true,
  );
  return (
    <AppShell
      padding="md"
      header={{ height: 60, collapsed: false }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: false, mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Header />

      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        {view === 'editor' && <ICUEditor />}
        {view === 'messages' && <MessagesMainSection />}
        {view === 'projects' && <ProjectsView />}
      </AppShell.Main>
    </AppShell>
  );
}
;

export default LandingPage;
