import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {ParallaxProvider} from 'react-scroll-parallax';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ParallaxProvider>
      <App />
    </ParallaxProvider>
  </StrictMode>,
);
