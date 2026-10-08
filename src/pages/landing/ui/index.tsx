import { AppShell } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';

import Navbar from './Navbar';
import Header from './Header/Header';
import ICUEditor from './Editor/Editor';
import ProjectsView from './Projects/View';
import { appStore } from '../config/store/app';
import ICUEditorFooter from './Editor/Footer/Footer';
import { hotkeys } from '@/shared/config/mantine/hotKeys';
import MessagesMainSection from './Messages/Main/MainSection';

const LandingPage = () => {
  const view = appStore.use.view();
  const opened = appStore.use.opened();
  const toggle = appStore.use.actions().toggle;
  useHotkeys(
    [
      [hotkeys.toggleNavbar, toggle],
    ],
    [],
    true,
  );
  return (
    <AppShell
      layout="alt"
      padding="md"
      footer={{ height: 400 }}
      header={{ height: 60, collapsed: false }}
      navbar={{
        breakpoint: 'sm',
        width: view === 'editor' ? 70 : 300,
        collapsed: { desktop: false, mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main
        h={0}
        display="flex"
        style={{ flexDirection: 'column' }}
      >
        {view === 'editor' && (<ICUEditor />)}
        {view === 'messages' && <MessagesMainSection />}
        {view === 'projects' && <ProjectsView />}
      </AppShell.Main>
      <AppShell.Footer>
        {view === 'editor' && <ICUEditorFooter />}

      </AppShell.Footer>
    </AppShell>
  );
}
;

export default LandingPage;
