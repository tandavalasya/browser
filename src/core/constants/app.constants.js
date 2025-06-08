// Application-wide constants
export const APP_CONSTANTS = {
  // Animation configuration
  ANIMATION: {
    PAGE_TRANSITION: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -30 },
      transition: { duration: 0.4 }
    },
    STAGGER: {
      CHILDREN: 0.15,
      LIST_CHILDREN: 0.18
    },
    SPRING: {
      stiffness: 60,
      damping: 15
    },
    UNDERLINE: {
      duration: 0.25
    }
  },

  // Route configuration
  ROUTES: {
    HOME: '/',
    GALLERY: '/gallery',
    GALLERY_DETAIL: '/gallery/:slug',
    ABOUT: '/about',
    BLOG: '/blog',
    BLOG_POST: '/blog/:slug',
    SCHEDULE: '/schedule',
    CONTACT: '/contact',
    INSTRUCTOR: '/instructor/:id'
  },

  // Navigation configuration
  NAVIGATION: [
    { to: '/', label: 'Home', key: 'home' },
    { to: '/gallery', label: 'Gallery', key: 'gallery' },
    { to: '/about', label: 'About', key: 'about' },
    { to: '/blog', label: 'Blog', key: 'blog' },
    { to: '/schedule', label: 'Schedule', key: 'schedule' },
    { to: '/contact', label: 'Contact', key: 'contact' }
  ],

  // Review system
  REVIEWS: {
    PER_PAGE: {
      MOBILE: 1,
      TABLET: 2,
      DESKTOP: 3
    },
    SOURCES: {
      SITE: 'site',
      GOOGLE: 'google'
    }
  },

  // Error messages
  ERRORS: {
    NETWORK: 'Network error occurred. Please check your connection.',
    GOOGLE_PLACES: 'Unable to load Google reviews at this time.',
    GENERAL: 'Something went wrong. Please try again later.',
    FORM_VALIDATION: 'Please fill in all required fields.',
    EMAIL_SEND: 'Failed to send email. Please try again.'
  },

  // Success messages
  SUCCESS: {
    EMAIL_SENT: 'Message sent successfully!',
    FORM_SUBMITTED: 'Form submitted successfully!'
  },

  // API configuration
  API: {
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 2000,
    TIMEOUT: 10000
  },

  // Theme configuration
  THEME: {
    COLORS: {
      PRIMARY: 'pink',
      SECONDARY: 'orange',
      ACCENT: 'purple'
    },
    BREAKPOINTS: {
      SM: 640,
      MD: 768,
      LG: 1024,
      XL: 1280
    }
  },

  // Social media configuration - now environment configurable
  SOCIAL: {
    INSTAGRAM: import.meta.env.VITE_INSTAGRAM_HANDLE,
    YOUTUBE: import.meta.env.VITE_YOUTUBE_HANDLE
  }
};

// Export individual sections for easier imports
export const ANIMATION_CONSTANTS = APP_CONSTANTS.ANIMATION;
export const ROUTE_CONSTANTS = APP_CONSTANTS.ROUTES;
export const NAVIGATION_CONSTANTS = APP_CONSTANTS.NAVIGATION;
export const ERROR_CONSTANTS = APP_CONSTANTS.ERRORS;
export const SUCCESS_CONSTANTS = APP_CONSTANTS.SUCCESS;
export const SOCIAL_CONSTANTS = APP_CONSTANTS.SOCIAL; 