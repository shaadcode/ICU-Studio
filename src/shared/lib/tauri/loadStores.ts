import { load } from '@tauri-apps/plugin-store';

export const loadStores = async () => {
  const projectsStore = await load('projects.json', { autoSave: false });

  return {
    projectsStore,
  };
};
