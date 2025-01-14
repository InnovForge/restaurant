import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
<<<<<<< HEAD
import { App } from './app';
=======
// import App from './App.jsx'
import {App} from './app'
>>>>>>> e9a6e1cd4bce80c00391ae8b91258ee731c5e7ba

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
