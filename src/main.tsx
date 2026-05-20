import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import './index.css'
import App from './App.tsx'

const cleanPath = window.location.pathname;
const isAppPath = cleanPath !== '/' && cleanPath !== '/index.html';

if (isAppPath) {
  window.history.replaceState(
    null,
    '',
    `/#${cleanPath}${window.location.search}`
  );
}

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
    <Toaster position="bottom-right" />
  </HashRouter>,
)
