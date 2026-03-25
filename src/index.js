import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

const root = ReactDOM.createRoot(document.getElementById('root'));

const AppWithProviders = GOOGLE_CLIENT_ID
  ? (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  )
  : <App />;

root.render(
  <React.StrictMode>
    <HelmetProvider>
      {AppWithProviders}
    </HelmetProvider>
  </React.StrictMode>
);
