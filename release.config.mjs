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
            // eslint-disable-next-line no-template-curly-in-string
            name: 'icu-studio-${nextRelease.version}.deb',
            path: 'src-tauri/target/release/bundle/deb/*.deb',
          },
          {
            label: 'RPM Package (Linux)',
            // eslint-disable-next-line no-template-curly-in-string
            name: 'icu-studio-${nextRelease.version}.rpm',
            path: 'src-tauri/target/release/bundle/rpm/*.rpm',
          },
          {
            label: 'AppImage (Linux)',
            // eslint-disable-next-line no-template-curly-in-string
            name: 'icu-studio-${nextRelease.version}.AppImage',
            path: 'src-tauri/target/release/bundle/appimage/*.AppImage',
          },
          {
            label: 'Windows Installer (NSIS)',
            path: 'src-tauri/target/release/bundle/nsis/*.exe',
            // eslint-disable-next-line no-template-curly-in-string
            name: 'icu-studio-${nextRelease.version}-setup.exe',
          },
          {
            label: 'Windows Installer (MSI)',
            // eslint-disable-next-line no-template-curly-in-string
            name: 'icu-studio-${nextRelease.version}.msi',
            path: 'src-tauri/target/release/bundle/msi/*.msi',
          },
          {
            label: 'macOS Disk Image',
            // eslint-disable-next-line no-template-curly-in-string
            name: 'icu-studio-${nextRelease.version}.dmg',
            path: 'src-tauri/target/release/bundle/dmg/*.dmg',
          },
        ],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        // eslint-disable-next-line no-template-curly-in-string
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
