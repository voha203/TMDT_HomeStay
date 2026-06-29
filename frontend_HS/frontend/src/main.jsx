import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <GoogleOAuthProvider clientId="167020054787-0ukfovqpb1jbrjbo0eovrn63lrf09ljb.apps.googleusercontent.com">
          <App />
      </GoogleOAuthProvider>
  </StrictMode>,
)
