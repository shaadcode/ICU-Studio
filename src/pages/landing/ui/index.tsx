import EditorView from './Editor/View';
import ProjectsView from './Projects/View';
import { appStore } from '../config/store/app';

const LandingPage = () => {
  const view = appStore.use.view();
  return (
    <>
      {view === 'editor' && <EditorView />}
      {view === 'projects' && <ProjectsView />}
    </>
  );
}
;

export default LandingPage;
