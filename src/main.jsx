import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import AOS from "aos";
import "aos/dist/aos.css";


AOS.init({
  duration:1200,
  once:true,
  offset:100
});


import { BrowserRouter } from "react-router-dom";


createRoot(document.getElementById('root')).render(

  <StrictMode>

    <BrowserRouter>
      <App />
    </BrowserRouter>

  </StrictMode>

)