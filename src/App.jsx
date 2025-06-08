/**
 * Main Application Component - Production Version
 * 
 * This is the main entry point of the TandavaLasya application.
 * Follows SOLID principles and modern React architecture patterns.
 * 
 * Architecture:
 * - Single Responsibility: Only handles app routing and layout orchestration
 * - Open/Closed: Extensible through route configuration
 * - Dependency Inversion: Uses composition and dependency injection
 * - Error Boundary: Comprehensive error handling with user-friendly fallbacks
 * - Logging: Structured logging for debugging and monitoring
 * 
 * @version 2.0.0
 * @author TandavaLasya Development Team
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Core components and utilities
import ErrorBoundary from './components/ui/ErrorBoundary/ErrorBoundary.jsx';
import { PageTransition } from './components/ui/Animation/AnimationWrapper.jsx';
import { logger } from './core/utils/logger.util.js';
import { errorHandler } from './core/utils/error-handler.util.js';

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
import BeginnerClasses from './pages/BeginnerClasses.jsx';
import IntermediateTraining from './pages/IntermediateTraining.jsx';
import PerformancePreparation from './pages/PerformancePreparation.jsx';

// Configuration and constants
import { ROUTE_CONSTANTS, NAVIGATION_CONSTANTS } from './core/constants/app.constants.js';

// Styles
import './App.css';

/**
 * Route Configuration
 * Centralizes all route definitions for maintainability and scalability
 * Following Open/Closed principle - can be extended without modifying existing code
 */
const ROUTE_CONFIG = [
  {
    path: ROUTE_CONSTANTS.HOME,
    element: Home,
    key: 'home',
    name: 'Home'
  },
  {
    path: ROUTE_CONSTANTS.GALLERY,
    element: Gallery,
    key: 'gallery',
    name: 'Gallery'
  },
  {
    path: ROUTE_CONSTANTS.GALLERY_DETAIL,
    element: GalleryEventDetail,
    key: 'gallery-detail',
    name: 'Gallery Event Detail'
  },
  {
    path: ROUTE_CONSTANTS.ABOUT,
    element: About,
    key: 'about',
    name: 'About'
  },
  {
    path: ROUTE_CONSTANTS.BLOG,
    element: Blog,
    key: 'blog',
    name: 'Blog'
  },
  {
    path: ROUTE_CONSTANTS.BLOG_POST,
    element: BlogPost,
    key: 'blog-post',
    name: 'Blog Post'
  },
  {
    path: ROUTE_CONSTANTS.SCHEDULE,
    element: Schedule,
    key: 'schedule',
    name: 'Schedule'
  },
  {
    path: ROUTE_CONSTANTS.CONTACT,
    element: Contact,
    key: 'contact',
    name: 'Contact'
  },
  {
    path: ROUTE_CONSTANTS.INSTRUCTOR,
    element: InstructorDetail,
    key: 'instructor',
    name: 'Instructor Detail'
  },
  {
    path: '/classes/beginner',
    element: BeginnerClasses,
    key: 'beginner-classes',
    name: 'Beginner Classes'
  },
  {
    path: '/classes/intermediate',
    element: IntermediateTraining,
    key: 'intermediate-training',
    name: 'Intermediate Training'
  },
  {
    path: '/classes/performance',
    element: PerformancePreparation,
    key: 'performance-preparation',
    name: 'Performance Preparation'
  }
];

/**
 * Animated Routes Component
 * Handles page transitions with animations and error boundaries
 * 
 * @returns {JSX.Element} Animated route components
 */
function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    // Log page navigation for analytics and debugging
    logger.info('Page navigation', {
      pathname: location.pathname,
      search: location.search,
      timestamp: new Date().toISOString()
    });
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {ROUTE_CONFIG.map(({ path, element: Component, key, name }) => (
          <Route
            key={key}
            path={path}
            element={
              <PageTransition>
                <ErrorBoundary
                  context={`Page: ${name}`}
                  showDetails={process.env.NODE_ENV === 'development'}
                  onError={(error, errorInfo) => {
                    logger.error(`Error in ${name} page`, {
                      error: error.message,
                      stack: error.stack,
                      componentStack: errorInfo.componentStack,
                      pathname: location.pathname
                    });
                  }}
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
 * Following Single Responsibility Principle - only manages layout
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Application layout
 */
function AppLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(prev => {
      const newState = !prev;
      logger.debug('Mobile menu toggled', { isOpen: newState });
      return newState;
    });
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
    logger.debug('Mobile menu closed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Background Elements */}
      <ErrorBoundary
        context="Background Elements"
        fallback={(error) => {
          logger.warn('Background elements failed to render', { error });
          return null; // Graceful degradation - app works without background elements
        }}
      >
        <BackgroundElements />
      </ErrorBoundary>
      
      {/* Navigation */}
      <ErrorBoundary
        context="Navigation"
        fallback={(error) => {
          logger.error('Navigation failed to render', { error });
          return (
            <div className="bg-red-50 border border-red-200 p-4 text-center">
              <p className="text-red-800">Navigation temporarily unavailable</p>
            </div>
          );
        }}
      >
        <Navigation
          navigationItems={NAVIGATION_CONSTANTS}
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
          onMobileMenuClose={handleMobileMenuClose}
        />
      </ErrorBoundary>
      
      {/* Main Content */}
      <main className="relative z-20">
        {children}
      </main>
      
      {/* Footer */}
      <ErrorBoundary
        context="Footer"
        fallback={(error) => {
          logger.warn('Footer failed to render', { error });
          return (
            <footer className="bg-gray-100 p-4 text-center text-gray-600">
              <p>&copy; 2024 TandavaLasya. All rights reserved.</p>
            </footer>
          );
        }}
      >
        <Footer />
      </ErrorBoundary>
    </div>
  );
}

/**
 * Main App Component
 * Entry point of the application with comprehensive error handling and logging
 * 
 * Features:
 * - Centralized error boundary
 * - Application-level logging
 * - Performance monitoring
 * - Graceful degradation
 * 
 * @returns {JSX.Element} Complete application
 */
function App() {
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Safe environment variable access
        const safeEnvAccess = (key, defaultValue = undefined) => {
          try {
            return typeof process !== 'undefined' && process.env ? process.env[key] : defaultValue;
          } catch {
            return defaultValue;
          }
        };

        logger.info('TandavaLasya App initialization started', {
          environment: safeEnvAccess('NODE_ENV', 'production'),
          version: safeEnvAccess('REACT_APP_VERSION', '1.0.0'),
          timestamp: new Date().toISOString(),
          userAgent: navigator?.userAgent || 'Unknown',
          language: navigator?.language || 'en',
          viewport: {
            width: window?.innerWidth || 0,
            height: window?.innerHeight || 0
          }
        });

        // Simple initialization without complex async operations
        setAppInitialized(true);
        
        logger.info('TandavaLasya App initialization completed successfully');
      } catch (error) {
        logger.error('App initialization error', { 
          message: error?.message || 'Unknown error',
          name: error?.name || 'Error'
        });
        
        // Always set initialized to true for graceful degradation
        setAppInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // Show loading state during initialization
  if (!appInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TandavaLasya...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      context="App Root"
      showDetails={process.env.NODE_ENV === 'development'}
      onError={(error, errorInfo) => {
        // Log critical application-level errors
        logger.error('Critical application error caught at root level', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          timestamp: new Date().toISOString()
        });

        // Could also send to external error reporting service here
        // Example: Sentry.captureException(error, { extra: errorInfo });
      }}
      onRetry={() => {
        logger.info('App root error boundary retry triggered');
        // Could perform any necessary cleanup or reinitialization
      }}
    >
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AppLayout>
          <AnimatedRoutes />
        </AppLayout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
