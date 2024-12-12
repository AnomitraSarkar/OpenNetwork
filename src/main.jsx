import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App input={[[3], [2], [6], [4], [5]]}/>
  </StrictMode>,
)
