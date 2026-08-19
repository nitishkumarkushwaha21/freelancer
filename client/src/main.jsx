import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SiteContentProvider } from './context/SiteContentContext';
import './styles/tailwind.css';
import './styles/global.css';
import './styles/admin.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <SiteContentProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SiteContentProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
