import { type as osType } from '@tauri-apps/plugin-os';

type ModKey = 'mod' | 'cmd' | 'alt' | 'ctrl' | 'meta' | 'shift';

const isMac = () => {
  try {
    return osType() === 'macos';
  } catch {
    return navigator.platform.toLowerCase().includes('mac');
  }
};

/**
 * Formats a hotkey string for display based on the current OS.
 *
 * @param hotkey - Raw hotkey string (e.g. `'mod+S'`, `'mod+shift+N'`)
 * @returns Formatted string ready for display
 *
 * @example
 * formatHotkey('mod+S')        // macOS: '⌘S'      | Win/Linux: 'Ctrl+S'
 * formatHotkey('mod+shift+N')  // macOS: '⌘⇧N'     | Win/Linux: 'Ctrl+Shift+N'
 * formatHotkey('mod+alt+K')    // macOS: '⌘⌥K'     | Win/Linux: 'Ctrl+Alt+K'
 */
export function formatHotkey(hotkey: string): string {
  const mac = isMac();
  const parts = hotkey.split('+').map(p => p.trim().toLowerCase());

  const map: Record<ModKey, { mac: string; other: string }> = {
    alt: { mac: '⌥', other: 'Alt' },
    meta: { mac: '⌘', other: 'Win' },
    mod: { mac: '⌘', other: 'Ctrl' },
    cmd: { mac: '⌘', other: 'Ctrl' },
    ctrl: { mac: '⌃', other: 'Ctrl' },
    shift: { mac: '⇧', other: 'Shift' },
  };

  const symbols = parts.map((p) => {
    const key = p as ModKey;
    if (map[key]) {
      return mac ? map[key].mac : map[key].other;
    }

    if (p.length === 1) {
      return p.toUpperCase();
    }

    const special: Record<string, string> = {
      up: '↑',
      tab: '⇥',
      down: '↓',
      left: '←',
      enter: '↵',
      esc: 'Esc',
      right: '→',
      escape: 'Esc',
      delete: 'Del',
      backspace: '⌫',
      space: 'Space',
    };
    return special[p] ?? p.charAt(0).toUpperCase() + p.slice(1);
  });

  return mac ? symbols.join('') : symbols.join('+');
}
