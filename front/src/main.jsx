import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import './styles/fonts.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <GoogleOAuthProvider clientId="573651962597-ghjrdckat3mquhrn5lufsevduduk2nlh.apps.googleusercontent.com">
                    <App />
            </GoogleOAuthProvider>
        </BrowserRouter>
    </StrictMode>
);
