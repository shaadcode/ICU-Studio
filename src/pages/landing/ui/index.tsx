import { AppShell, useMantineTheme } from '@mantine/core';
import { useHotkeys, useMediaQuery } from '@mantine/hooks';

import Navbar from './Navbar';
import ICUEditor from './Editor/Editor';
import { appStore } from '../config/store/app';
import ICUEditorFooter from './Editor/Footer/Footer';
import { MOBILE_BREAKPOINT } from '@/shared/lib/mantine';
import { hotkeys } from '@/shared/config/mantine/hotKeys';
import ICUEditorAside from './Editor/Aside/ICUEditorAside';
import MessagesMainSection from './Messages/Main/MainSection';
import ICUEditorHeader from './Editor/Header/ICUEditorHeader';
import I18nManagementViewMain from './I18nManager/Main/I18nManagementViewMain';

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
        {view === 'editor' && <ICUEditorHeader />}
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
        {view === 'i18nManager' && <I18nManagementViewMain />}
      </AppShell.Main>

      <AppShell.Aside>
        {(view === 'editor' || view === 'messages') && <ICUEditorAside />}
      </AppShell.Aside>
      <AppShell.Footer>
        {(view === 'editor' || view === 'messages') && <ICUEditorFooter />}
      </AppShell.Footer>
    </AppShell>
  );
}
;

export default LandingPage;
