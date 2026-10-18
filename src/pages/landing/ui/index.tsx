import { AppShell } from '@mantine/core';

import Navbar from './Navbar';
import ICUEditor from './Editor/Editor';
import ICUEditorFooter from './Editor/Footer/Footer';
import { useHandleLanding } from './useHandleLanding';
import ICUEditorAside from './Editor/Aside/ICUEditorAside';
import MessagesMainSection from './Messages/Main/MainSection';
import ICUEditorHeader from './Editor/Header/ICUEditorHeader';
import I18nManagerHeader from './I18nManager/Header/I18nManagerHeader';
import I18nManagerSidebar from './I18nManager/Sidebar/I18nManagerSidebar';
import I18nManagementViewMain from './I18nManager/Main/I18nManagementViewMain';

const LandingPage = () => {
  const appshellHandlers = useHandleLanding();
  return (
    <AppShell
      padding="md"
      aside={appshellHandlers.layout.aside}
      layout={appshellHandlers.layout.layout}
      header={appshellHandlers.layout.header}
      footer={appshellHandlers.layout.footer}
      navbar={appshellHandlers.layout.navbar}
    >
      <AppShell.Header>
        {appshellHandlers.view === 'editor' && <ICUEditorHeader />}
        {appshellHandlers.view === 'i18nManager' && <I18nManagerHeader />}
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main display="flex">
        {appshellHandlers.view === 'editor' && (<ICUEditor />)}
        {appshellHandlers.view === 'messages' && <MessagesMainSection />}
        {appshellHandlers.view === 'i18nManager' && <I18nManagementViewMain />}
      </AppShell.Main>

      <AppShell.Aside>
        {(appshellHandlers.view === 'editor' || appshellHandlers.view === 'messages') && <ICUEditorAside />}
        {appshellHandlers.view === 'i18nManager' && <I18nManagerSidebar />}
      </AppShell.Aside>
      <AppShell.Footer>
        {(appshellHandlers.view === 'editor' || appshellHandlers.view === 'messages') && <ICUEditorFooter />}
      </AppShell.Footer>
    </AppShell>
  );
}
;

export default LandingPage;
