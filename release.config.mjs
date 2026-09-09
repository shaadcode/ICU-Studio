/* eslint-disable no-template-curly-in-string */
/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: [
    'main',
    {
      name: 'beta',
      prerelease: true,
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            label: 'Debian Package (Linux)',
            name: 'icu-studio-${nextRelease.version}.deb',
            path: 'artifacts/*/src-tauri/target/release/bundle/deb/*.deb',
          },
          {
            label: 'RPM Package (Linux)',
            name: 'icu-studio-${nextRelease.version}.rpm',
            path: 'artifacts/*/src-tauri/target/release/bundle/rpm/*.rpm',
          },
          {
            label: 'AppImage (Linux)',
            name: 'icu-studio-${nextRelease.version}.AppImage',
            path: 'artifacts/*/src-tauri/target/release/bundle/appimage/*.AppImage',
          },
          {
            label: 'Windows Installer (NSIS)',
            name: 'icu-studio-${nextRelease.version}-setup.exe',
            path: 'artifacts/*/src-tauri/target/release/bundle/nsis/*.exe',
          },
          {
            label: 'Windows Installer (MSI)',
            name: 'icu-studio-${nextRelease.version}.msi',
            path: 'artifacts/*/src-tauri/target/release/bundle/msi/*.msi',
          },
          {
            label: 'macOS Disk Image',
            name: 'icu-studio-${nextRelease.version}.dmg',
            path: 'artifacts/*/src-tauri/target/release/bundle/dmg/*.dmg',
          },
        ],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],

        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
