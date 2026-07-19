/*
------------------------------------------------
File: presets.js
Purpose: Holds all reusable animation profiles.
Responsibilities: Exposes standard Framer Motion fade-in, scale-up, slide-in configs.
Dependencies: framer-motion
------------------------------------------------
*/

export const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

export const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const scaleHover = {
  hover: { scale: 1.02, y: -2 },
  tap: { scale: 0.98 }
};
