import { useEffect } from 'react';
import { readDir } from '@tauri-apps/plugin-fs';

import { appStore } from '@/pages/landing/config/store/app';

const NamespacesByLocale = () => {
  const selectedLocale = appStore.use.selectedLocale();
  const selectedProject = appStore.use.selectedProject();

  useEffect(() => {
    if (selectedLocale && selectedProject) {
      (async () => {
        const namespaces = await readDir(`${selectedProject.dirPath}\\${selectedLocale.name}`);
        console.log(namespaces);
      })();
    }
  }, [selectedLocale, selectedProject]);

  return (
    <div>{'NamespacesByLocale'}</div>
  );
};

export default NamespacesByLocale;
