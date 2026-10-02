/* eslint-disable perfectionist/sort-imports */
import { scan } from 'react-scan';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import Providers from './app/providers';

scan({
  enabled: import.meta.env.DEV,
});
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
);
