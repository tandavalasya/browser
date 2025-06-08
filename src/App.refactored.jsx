/**
 * Main Application Component - Refactored
 * Follows SOLID principles and uses new architecture patterns
 * - Single Responsibility: Only handles app routing and layout
 * - Open/Closed: Can be extended with new routes without modification
 * - Dependency Inversion: Uses composition and dependency injection
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Core components
import ErrorBoundary from './components/ui/ErrorBoundary/ErrorBoundary.jsx';
import { PageTransition } from './components/ui/Animation/AnimationWrapper.jsx';

// Layout components
import Navigation from './components/layout/Navigation/Navigation.jsx';
import Footer from './components/layout/Footer/Footer.jsx';
import BackgroundElements from './components/layout/Background/BackgroundElements.jsx';

// Page components
import Home from './pages/Home.jsx';
import Gallery from './pages/Gallery.jsx';
import About from './pages/About.jsx';
import Blog from './pages/Blog.jsx';
import Schedule from './pages/Schedule.jsx';
import Contact from './pages/Contact.jsx';
import BlogPost from './pages/BlogPost.jsx';
import GalleryEventDetail from './pages/GalleryEventDetail.jsx';
import InstructorDetail from './pages/InstructorDetail.jsx';

// Constants and configuration
import { ROUTE_CONSTANTS, NAVIGATION_CONSTANTS } from './core/constants/app.constants.js';
import { logger } from './core/utils/logger.util.js';

// Styles
import './App.css';

/**
 * Route Configuration
 * Centralizes route definitions for maintainability
 */
const ROUTE_CONFIG = [
  {
    path: ROUTE_CONSTANTS.HOME,
    element: Home,
    key: 'home'
  },
  {
    path: ROUTE_CONSTANTS.GALLERY,
    element: Gallery,
    key: 'gallery'
  },
  {
    path: ROUTE_CONSTANTS.GALLERY_DETAIL,
    element: GalleryEventDetail,
    key: 'gallery-detail'
  },
  {
    path: ROUTE_CONSTANTS.ABOUT,
    element: About,
    key: 'about'
  },
  {
    path: ROUTE_CONSTANTS.BLOG,
    element: Blog,
    key: 'blog'
  },
  {
    path: ROUTE_CONSTANTS.BLOG_POST,
    element: BlogPost,
    key: 'blog-post'
  },
  {
    path: ROUTE_CONSTANTS.SCHEDULE,
    element: Schedule,
    key: 'schedule'
  },
  {
    path: ROUTE_CONSTANTS.CONTACT,
    element: Contact,
    key: 'contact'
  },
  {
    path: ROUTE_CONSTANTS.INSTRUCTOR,
    element: InstructorDetail,
    key: 'instructor'
  }
];

/**
 * Animated Routes Component
 * Handles page transitions with animations
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {ROUTE_CONFIG.map(({ path, element: Component, key }) => (
          <Route
            key={key}
            path={path}
            element={
              <PageTransition>
                <ErrorBoundary
                  context={`Page: ${key}`}
                  showDetails={process.env.NODE_ENV === 'development'}
                >
                  <Component />
                </ErrorBoundary>
              </PageTransition>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
}

/**
 * App Layout Component
 * Handles the overall application layout structure
 */
function AppLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Background Elements */}
      <BackgroundElements />
      
      {/* Navigation */}
      <Navigation
        navigationItems={NAVIGATION_CONSTANTS}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
        onMobileMenuClose={handleMobileMenuClose}
      />
      
      {/* Main Content */}
      <main className="relative z-20">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

/**
 * Main App Component
 * Entry point of the application
 */
function App() {
  // Log app initialization
  React.useEffect(() => {
    logger.info('TandavaLasya App initialized', {
      environment: process.env.NODE_ENV,
      version: process.env.REACT_APP_VERSION || '1.0.0'
    });
  }, []);

  return (
    <ErrorBoundary
      context="App Root"
      showDetails={process.env.NODE_ENV === 'development'}
      onError={(error, errorInfo) => {
        logger.error('Root level error caught', { error, errorInfo });
      }}
    >
      <Router>
        <AppLayout>
          <AnimatedRoutes />
        </AppLayout>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 