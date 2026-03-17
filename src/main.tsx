import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fontsource/inter"; 
import "@fontsource/inter/700.css";
import './index.css'
import { AuthProvider } from './features/auth/hooks/useAuth';
import App from './App';
import { BrowserRouter } from 'react-router-dom';


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