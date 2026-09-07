import { AppShell } from '@mantine/core';

import Navbar from './Navbar/Navbar';
import ProjectMain from './Main/ProjectMain';
import Header from '../Projects/Header/Header';

const ProjectsView = () => {
  return (

    <AppShell
      padding="md"
      header={{ height: 60, collapsed: false }}
      navbar={{ width: 300, breakpoint: 'sn', collapsed: { desktop: false } }}
    >
      <AppShell.Header p="md">
        <Header />
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <ProjectMain />
      </AppShell.Main>
    </AppShell>
  );
}
;

export default ProjectsView;
