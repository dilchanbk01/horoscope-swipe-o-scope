
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to create star background
const createStarryBackground = () => {
  const starsContainer = document.querySelector('.stars-container');
  if (!starsContainer) return;
  
  // Clear any existing stars
  starsContainer.innerHTML = '';
  
  // Create different types of stars for a more dynamic background
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    
    // Add occasional "twinkle" effect
    if (Math.random() > 0.7) {
      star.classList.add('twinkle');
    }
    
    starsContainer.appendChild(star);
  }
  
  // Add a few nebulae
  for (let i = 0; i < 3; i++) {
    const nebula = document.createElement('div');
    nebula.className = 'nebula';
    
    nebula.style.left = `${Math.random() * 100}%`;
    nebula.style.top = `${Math.random() * 100}%`;
    nebula.style.opacity = `${Math.random() * 0.1 + 0.05}`;
    nebula.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    const hue = Math.floor(Math.random() * 60) + 240; // Blues and purples
    nebula.style.backgroundColor = `hsla(${hue}, 70%, 60%, 0.5)`;
    
    starsContainer.appendChild(nebula);
  }
};

// Register the event handler for the PWA installation
const registerPWAEvents = () => {
  // Variable to store install prompt
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // You could add logic here to show a custom "Add to Home Screen" button
    console.log('PWA installation available');
  });
  
  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    // Clear the prompt variable
    deferredPrompt = null;
  });
};

// Initialize after render
createRoot(document.getElementById("root")!).render(<App />);

// Create stars after the app has rendered
setTimeout(createStarryBackground, 100);

// Register PWA events
registerPWAEvents();

// Update stars on window resize
window.addEventListener('resize', () => {
  setTimeout(createStarryBackground, 100);
});
