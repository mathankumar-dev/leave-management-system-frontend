import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 1. Import the provider
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './features/auth/hooks/useAuth.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  
    {/*  BrowserRouter For Routing */}
    
    <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)