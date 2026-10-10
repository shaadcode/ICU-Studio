import { AppShell, useMantineTheme } from '@mantine/core';
import { useHotkeys, useMediaQuery } from '@mantine/hooks';

import Navbar from './Navbar';
import Header from './Header/Header';
import ICUEditor from './Editor/Editor';
import ProjectsView from './Projects/View';
import { appStore } from '../config/store/app';
import ICUEditorFooter from './Editor/Footer/Footer';
import { MOBILE_BREAKPOINT } from '@/shared/lib/mantine';
import { hotkeys } from '@/shared/config/mantine/hotKeys';
import ICUEditorAside from './Editor/Aside/ICUEditorAside';
import MessagesMainSection from './Messages/Main/MainSection';

const LandingPage = () => {
  const view = appStore.use.view();
  const navbarOpened = appStore.use.navbar();
  const sidebarOpened = appStore.use.sidebar();
  const toggle = appStore.use.actions().toggle;
  const theme = useMantineTheme();
  const isBelowMd = useMediaQuery(`(max-width: ${theme.breakpoints[MOBILE_BREAKPOINT]})`);

  useHotkeys(
    [
      [hotkeys.toggleNavbar, () => toggle('navbar')],
      [hotkeys.toggleSideBar, () => toggle('sidebar')],
    ],
    [],
    true,
  );

  return (
    <AppShell
      layout="alt"
      padding="md"
      header={{ height: 60, collapsed: false }}
      footer={{ height: 400, collapsed: isBelowMd }}
      aside={{
        width: 400,
        breakpoint: MOBILE_BREAKPOINT,
        collapsed: { desktop: false, mobile: !sidebarOpened },
      }}
      navbar={{
        breakpoint: MOBILE_BREAKPOINT,
        width: view === 'editor' ? 70 : 300,
        collapsed: { desktop: false, mobile: !navbarOpened },
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Navbar maw={isBelowMd ? 'fit-content' : undefined}>
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

      <AppShell.Aside>
        {view === 'editor' && <ICUEditorAside />}
      </AppShell.Aside>
      <AppShell.Footer>
        {view === 'editor' && <ICUEditorFooter />}

      </AppShell.Footer>
    </AppShell>
  );
}
;

export default LandingPage;
