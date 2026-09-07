import ISO6391 from 'iso-639-1';
import { useEffect } from 'react';
import { useTranslations } from 'use-intl';
import { readDir } from '@tauri-apps/plugin-fs';
import { Text, Stack, Divider, Scroller, SimpleGrid, SegmentedControl } from '@mantine/core';

import NamespacesByLocale from './NamespacesByLocale';
import { appStore } from '@/pages/landing/config/store/app';

const ProjectMain = () => {
  const selectedProject = appStore.use.selectedProject();
  const setLocales = appStore.use.actions().setLocales;
  const setSelectedLocale = appStore.use.actions().setSelectedLocale;
  const locales = appStore.use.locales();
  const t = useTranslations('projects');

  const handleSelectedLocale = (incomingLocale: string) => {
    const selectedLocale = locales.find(locale => locale.name === incomingLocale);
    console.log(selectedLocale);
    console.log(incomingLocale);
    if (selectedLocale) {
      setSelectedLocale(selectedLocale);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      (async () => {
        const locales = await readDir(selectedProject.dirPath);
        setLocales(locales.filter(locale => ISO6391.validate(locale.name)));
      })();
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return null;
  }
  return (
    <Stack>
      <Text fw={600} ta="center" tt="capitalize">
        {selectedProject.name}
      </Text>

      <SimpleGrid cols={{ md: 2, base: 1 }}>
        <Stack gap="xs">
          <Text tt="capitalize">
            {t('locales')}
          </Text>
          <Divider />
          <Scroller maw={350}>
            <SegmentedControl
              data={locales.map(locale => locale.name)}

              onChange={handleSelectedLocale}
            />
          </Scroller>
        </Stack>
        <NamespacesByLocale />
      </SimpleGrid>
    </Stack>
  );
};

export default ProjectMain;
