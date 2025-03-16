
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to create star background
const createStarryBackground = () => {
  const starsContainer = document.querySelector('.stars-container');
  if (!starsContainer) return;
  
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    
    starsContainer.appendChild(star);
  }
};

// Initialize after render
createRoot(document.getElementById("root")!).render(<App />);

// Create stars after the app has rendered
setTimeout(createStarryBackground, 100);
