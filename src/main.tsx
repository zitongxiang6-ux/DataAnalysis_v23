import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
    <Toaster position="bottom-right" />
  </HashRouter>,
)
