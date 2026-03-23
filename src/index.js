import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

const root = ReactDOM.createRoot(document.getElementById('root'));

// GoogleOAuthProvider requires a non-empty clientId — wrap conditionally
const AppWithProviders = GOOGLE_CLIENT_ID
  ? (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  )
  : <App />;

root.render(
  <React.StrictMode>
    {AppWithProviders}
  </React.StrictMode>
);
