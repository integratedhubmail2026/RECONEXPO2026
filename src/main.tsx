import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ExpoDataProvider } from './context/ExpoDataContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ExpoDataProvider>
        <App />
      </ExpoDataProvider>
    </ErrorBoundary>
  </StrictMode>,
);


