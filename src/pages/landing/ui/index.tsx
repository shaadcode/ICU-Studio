import { useDisclosure } from '@mantine/hooks';
import { Text, Group, Burger, AppShell } from '@mantine/core';

import Navbar from './Navbar/Navbar';

const LandingPage = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      padding="md"
      header={{ height: 60, collapsed: true }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
    >
      <AppShell.Header>
        <Group px="md" h="100%">
          <Burger
            size="sm"
            opened={opened}
            hiddenFrom="sm"

            onClick={toggle}
          />
          {'Header has a burger icon below sm breakpoint\r'}
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Text>{'This is the main section, your app content here.'}</Text>
        <Text>{'Layout used in most cases – Navbar and Header with fixed position'}</Text>
      </AppShell.Main>
    </AppShell>
  );
}
;

export default LandingPage;
