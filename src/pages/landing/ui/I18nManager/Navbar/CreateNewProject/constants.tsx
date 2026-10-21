import { IconFolder, IconFileText, IconFolderOpen } from '@tabler/icons-react';

import type { StructureType, StructureOption } from './types';

export const STRUCTURE_OPTIONS: StructureOption[] = [
  {
    icon: <IconFolder size={20} />,
    example: 'locales/en/common.json',
    value: 'locale-folder-namespace-file',
    title: 'Locale Folders + Namespace Files',
    description:
      'Each locale has its own folder and each JSON file represents a namespace.',
  },
  {
    example: 'en.json',
    icon: <IconFileText size={20} />,
    value: 'locale-file-nested-namespaces',
    title: 'Locale Files with Nested Namespaces',
    description: 'All namespaces are inside a single file per locale.',
  },
  {
    value: 'namespace-path-prefix',
    title: 'Namespace as Path Prefix',
    icon: <IconFolderOpen size={20} />,
    example: 'locales/en/dashboard/user.json',
    description:
      'Namespace is derived from the file path relative to the locale folder.',
  },
];

export const LOCALE_OPTIONS = [
  { value: 'en', label: '🇬🇧 English (en)' },
  { value: 'fa', label: '🇮🇷 Persian (fa)' },
  { value: 'de', label: '🇩🇪 German (de)' },
  { value: 'fr', label: '🇫🇷 French (fr)' },
  { value: 'ar', label: '🇸🇦 Arabic (ar)' },
];

export const STRUCTURE_PREVIEWS: Record<
  StructureType,
  {
    tree: string;
    detectItems: string[];
  }
> = {
  'locale-file-nested-namespaces': {
    tree: `messages/
├── en.json
└── fa.json

// en.json
{
  "common": { ... },
  "checkout": { ... },
  "profile": { ... }
}`,
    detectItems: [
      'Locales (e.g. en, fa)',
      'Nested namespaces in single file',
      'File per locale',
      'Default locale',
    ],
  },
  'locale-folder-namespace-file': {
    detectItems: [
      'Locales (e.g. en, fa, de)',
      'Namespaces (e.g. common, checkout)',
      'Folder per locale',
      'Default locale',
    ],
    tree: `messages/
├── en/
│   ├── common.json
│   ├── checkout.json
│   └── profile.json
└── fa/
    ├── common.json
    ├── checkout.json
    └── profile.json`,
  },
  'namespace-path-prefix': {
    detectItems: [
      'Locales (e.g. en, fa)',
      'Namespaces from file paths',
      'Nested folder structure',
      'Default locale',
    ],
    tree: `messages/
├── en/
│   ├── common.json
│   └── dashboard/
│       ├── user.json
│       └── settings.json
└── fa/
    ├── common.json
    └── dashboard/
        ├── user.json
        └── settings.json`,
  },
};
