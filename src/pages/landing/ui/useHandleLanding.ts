import { useState, useEffect } from 'react';
import { useMantineTheme } from '@mantine/core';
import type { AppShellProps } from '@mantine/core';
import { useHotkeys, useMediaQuery } from '@mantine/hooks';

import { appStore } from '../config/store/app';
import { MOBILE_BREAKPOINT } from '@/shared/lib/mantine';
import { hotkeys } from '@/shared/config/mantine/hotKeys';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type LayoutFactory = (ctx: LayoutContext) => AppShellHandlers;

type LayoutContext = {
  isBelowMd: boolean;
  navbarOpened: boolean;
  sidebarOpened: boolean;
};

type AppShellHandlers = {
  aside: AppShellProps['aside'];
  layout: AppShellProps['layout'];
  header: AppShellProps['header'];
  footer: AppShellProps['footer'];
  navbar: AppShellProps['navbar'];
};

const createEditorViewLayout: LayoutFactory = ({ isBelowMd }) => ({
  layout: 'alt',
  header: { height: 60, collapsed: false },
  footer: { height: 400, collapsed: isBelowMd },
  aside: {
    width: 400,
    breakpoint: MOBILE_BREAKPOINT,
  },
  navbar: {
    width: 70,
    breakpoint: MOBILE_BREAKPOINT,
  },
});

const createMessagesViewLayout: LayoutFactory = ({ isBelowMd }) => ({
  layout: 'alt',
  header: { height: 60, collapsed: false },
  footer: { height: 400, collapsed: isBelowMd },
  aside: {
    width: 400,
    breakpoint: MOBILE_BREAKPOINT,
  },
  navbar: {
    width: 300,
    breakpoint: MOBILE_BREAKPOINT,
  },
});

const createI18nManagerViewLayout: LayoutFactory = ({ isBelowMd }) => ({
  aside: undefined,
  layout: 'default',
  header: { height: 60, collapsed: false },
  footer: { height: 60, collapsed: isBelowMd },
  // {
  //   width: 400,
  //   breakpoint: MOBILE_BREAKPOINT,
  // },
  navbar: {
    width: 300,
    breakpoint: MOBILE_BREAKPOINT,
  },
});

const LAYOUT_FACTORIES_BY_VIEW: Record<string, LayoutFactory> = {
  editor: createEditorViewLayout,
  messages: createMessagesViewLayout,
  i18nManager: createI18nManagerViewLayout,
};

export const useHandleLanding = () => {
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

  const [appshellHandlers, setAppshellHandlers] = useState<AppShellHandlers>(() =>
    createEditorViewLayout({
      navbarOpened,
      sidebarOpened,
      isBelowMd: isBelowMd ?? false,
    }),
  );

  useEffect(() => {
    const factory = LAYOUT_FACTORIES_BY_VIEW[view!];
    if (!factory) {
      return;
    }

    setAppshellHandlers(
      factory({
        navbarOpened,
        sidebarOpened,
        isBelowMd: isBelowMd ?? false,
      }),
    );
  }, [view, isBelowMd, navbarOpened, sidebarOpened]);

  return {
    view,
    layout: appshellHandlers,
  };
};
