/**
 * About Page Component
 * 
 * Displays information about TandavaLasya, mission, vision, and instructors.
 * Refactored to follow SOLID principles and modern React patterns.
 * 
 * Architecture:
 * - Single Responsibility: Each component has one clear purpose
 * - Open/Closed: Extensible through configuration and composition
 * - Dependency Inversion: Uses service injection and configuration
 * - Error Boundaries: Comprehensive error handling with graceful degradation
 * - Performance: Optimized with proper memoization and lazy loading
 * 
 * Features:
 * - Mission and vision section
 * - Core tenets and values
 * - Instructor showcase with navigation
 * - Responsive design with accessibility compliance
 * - Comprehensive logging and error handling
 * 
 * @version 2.0.0
 * @author TandavaLasya Development Team
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Core utilities and services
import { logger } from '../core/utils/logger.util.js';
import { errorHandler } from '../core/utils/error-handler.util.js';

// UI Components
import ErrorBoundary from '../components/ui/ErrorBoundary/ErrorBoundary.jsx';
import { 
  AnimationWrapper, 
  StaggerContainer, 
  StaggerItem 
} from '../components/ui/Animation/AnimationWrapper.jsx';

// Configuration and constants
import { 
  ANIMATION_CONSTANTS, 
  ERROR_CONSTANTS 
} from '../core/constants/app.constants.js';

// Local data
import instructorsData from '../config/instructors.json';

/**
 * Hero Section Component
 * Displays the main about header and introduction
 * 
 * @returns {JSX.Element} Hero section
 */
function AboutHero() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <AnimationWrapper variant="fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              TandavaLasya
            </span>
          </h1>
        </AnimationWrapper>

        <AnimationWrapper variant="fadeIn" motionProps={{ transition: { delay: 0.2 } }}>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Welcome to TandavaLasya, where tradition meets innovation. Led by{' '}
            <span className="font-bold text-pink-600">Bhargavi Venkataraman</span>, 
            MFA (Bharatanatyam), Grade B Doordarshan artist, and award-winning performer, 
            our school inspires students of all ages to discover the joy and discipline of Bharatanatyam.
          </p>
        </AnimationWrapper>
      </div>
    </section>
  );
}

/**
 * Mission and Vision Section Component
 * Displays the school's mission and vision statements
 * 
 * @returns {JSX.Element} Mission and vision section
 */
function MissionVisionSection() {
  const content = {
    mission: `At TandavaLasya, our mission is to nurture a lifelong love for Bharatanatyam by 
              blending tradition with creativity, discipline with joy, and art with holistic well-being. 
              We believe that dance is not just a performance, but a journey of self-discovery, 
              health, and community.`,
    vision: `Our vision is to create a vibrant, inclusive space where students of all ages and 
             backgrounds can experience the transformative power of Bharatanatyam. We are committed 
             to fostering not only artistic excellence, but also physical fitness, mental resilience, 
             and a deep sense of belonging.`
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <AnimationWrapper variant="fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Mission & Vision
          </h2>
        </AnimationWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <AnimationWrapper variant="fadeIn" motionProps={{ transition: { delay: 0.2 } }}>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {content.mission}
              </p>
            </div>
          </AnimationWrapper>

          <AnimationWrapper variant="fadeIn" motionProps={{ transition: { delay: 0.4 } }}>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-2xl">🌟</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Vision</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {content.vision}
              </p>
            </div>
          </AnimationWrapper>
        </div>
      </div>
    </section>
  );
}

/**
 * Core Tenets Section Component
 * Displays the school's core values and principles
 * 
 * @returns {JSX.Element} Core tenets section
 */
function CoreTenetsSection() {
  const tenets = [
    {
      icon: '🙏',
      text: 'Respect for the ancient art of Bharatanatyam, honoring its history and spiritual roots'
    },
    {
      icon: '💡',
      text: 'Encouraging curiosity, creativity, and innovation in every student'
    },
    {
      icon: '💪',
      text: 'Promoting physical health through structured warm-ups, mindful stretching, and safe technique'
    },
    {
      icon: '🧠',
      text: 'Building mental resilience, focus, and confidence through disciplined practice'
    },
    {
      icon: '🤝',
      text: 'Fostering a sense of community, empathy, and cultural appreciation'
    },
    {
      icon: '🌱',
      text: 'Celebrating each dancer\'s unique journey and growth'
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimationWrapper variant="fadeIn">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Tenets
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The fundamental principles that guide our teaching and community
            </p>
          </div>
        </AnimationWrapper>

        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tenets.map((tenet, index) => (
              <StaggerItem key={index}>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-4xl mb-4 text-center">{tenet.icon}</div>
                  <p className="text-gray-700 leading-relaxed text-center">
                    {tenet.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}

/**
 * Instructor Card Component
 * Displays individual instructor information with navigation
 * 
 * @param {Object} props - Component props
 * @param {Object} props.instructor - Instructor data
 * @param {number} props.index - Index for animation delay
 * @returns {JSX.Element} Instructor card
 */
function InstructorCard({ instructor, index }) {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    logger.info('Instructor card clicked', {
      instructorId: instructor.id,
      instructorName: instructor.name,
      timestamp: new Date().toISOString()
    });
    navigate(`/instructor/${instructor.id}`);
  }, [instructor.id, instructor.name, navigate]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const handleImageError = useCallback((e) => {
    logger.warn('Instructor image failed to load', { 
      instructorId: instructor.id,
      originalSrc: e.target.src 
    });
    e.target.src = '/images/default-instructor.jpg';
  }, [instructor.id]);

  if (!instructor) {
    logger.warn('InstructorCard received null instructor');
    return null;
  }

  return (
    <AnimationWrapper 
      variant="scale" 
      motionProps={{ 
        transition: { delay: index * 0.2 },
        onClick: handleClick,
        onKeyPress: handleKeyPress,
        tabIndex: 0,
        role: "button",
        "aria-label": `View details for ${instructor.name}`,
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 }
      }}
      className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 group"
    >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Instructor Image */}
          <div className="flex-shrink-0">
            <img
              src={instructor.image}
              alt={`${instructor.name} - ${instructor.title}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-pink-100 shadow-lg group-hover:border-pink-200 transition-colors duration-300"
              onError={handleImageError}
              loading="lazy"
            />
          </div>

          {/* Instructor Info */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors duration-300">
              {instructor.name}
            </h3>
            <p className="text-pink-600 font-semibold text-lg mb-4">
              {instructor.title}
            </p>
            <div className="text-gray-700 leading-relaxed">
              <ErrorBoundary
                context={`Instructor Bio: ${instructor.name}`}
                fallback={(error) => {
                  logger.warn('Error rendering instructor bio', { 
                    instructorId: instructor.id, 
                    error 
                  });
                  return (
                    <p className="text-gray-600 italic">
                      Bio temporarily unavailable
                    </p>
                  );
                }}
              >
                <ReactMarkdown>{instructor.shortBio}</ReactMarkdown>
              </ErrorBoundary>
            </div>
            
            {/* Call to Action */}
            <div className="mt-4 flex items-center justify-center md:justify-start text-pink-600 font-semibold group-hover:text-pink-700 transition-colors duration-300">
              <span>Learn More</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
    </AnimationWrapper>
  );
}

/**
 * Instructors Section Component
 * Manages instructor data loading and display
 * 
 * @returns {JSX.Element} Instructors section
 */
function InstructorsSection() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        logger.info('Loading instructors data');
        setLoading(true);
        setError(null);

        // Simulate async loading for consistency
        await new Promise(resolve => setTimeout(resolve, 100));

        setInstructors(instructorsData);
        logger.info('Instructors loaded successfully', { 
          count: instructorsData.length 
        });

      } catch (error) {
        const handledError = errorHandler.handle(error, 'Instructors Loading');
        setError(handledError.message);
        logger.error('Failed to load instructors', handledError);
      } finally {
        setLoading(false);
      }
    };

    loadInstructors();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="space-y-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 animate-pulse">
                  <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-48"></div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded"></div>
                      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-300 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              Unable to Load Instructors
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <AnimationWrapper variant="fadeIn">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Instructors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced and passionate teachers dedicated to your dance journey
            </p>
          </div>
        </AnimationWrapper>

        <div className="space-y-8">
          {instructors.map((instructor, index) => (
            <ErrorBoundary
              key={instructor.id}
              context={`Instructor Card: ${instructor.name}`}
              fallback={(error) => {
                logger.error('Instructor card error', { 
                  instructorId: instructor.id, 
                  error 
                });
                return (
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <p className="text-gray-600">
                      Unable to display instructor information
                    </p>
                  </div>
                );
              }}
            >
              <InstructorCard instructor={instructor} index={index} />
            </ErrorBoundary>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Main About Page Component
 * Orchestrates all about page sections with proper error boundaries
 * 
 * @returns {JSX.Element} Complete about page
 */
function About() {
  useEffect(() => {
    logger.info('About page mounted', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });

    return () => {
      logger.debug('About page unmounted');
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ErrorBoundary
        context="About Hero Section"
        fallback={(error) => {
          logger.error('About hero section error', { error });
          return (
            <section className="py-20">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">About TandavaLasya</h1>
                <p className="text-xl text-gray-600">Learn about our dance school and mission</p>
              </div>
            </section>
          );
        }}
      >
        <AboutHero />
      </ErrorBoundary>

      {/* Mission & Vision */}
      <ErrorBoundary
        context="Mission Vision Section"
        fallback={(error) => {
          logger.error('Mission vision section error', { error });
          return (
            <section className="py-20 bg-gray-50">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
                <p className="text-gray-600">Information temporarily unavailable</p>
              </div>
            </section>
          );
        }}
      >
        <MissionVisionSection />
      </ErrorBoundary>

      {/* Core Tenets */}
      <ErrorBoundary
        context="Core Tenets Section"
        fallback={(error) => {
          logger.error('Core tenets section error', { error });
          return (
            <section className="py-20">
              <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Tenets</h2>
                <p className="text-gray-600">Values information temporarily unavailable</p>
              </div>
            </section>
          );
        }}
      >
        <CoreTenetsSection />
      </ErrorBoundary>

      {/* Instructors */}
      <ErrorBoundary
        context="Instructors Section"
        fallback={(error) => {
          logger.error('Instructors section error', { error });
          return (
            <section className="py-20 bg-gray-50">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Instructors</h2>
                <p className="text-gray-600">Instructor information temporarily unavailable</p>
              </div>
            </section>
          );
        }}
      >
        <InstructorsSection />
      </ErrorBoundary>
    </div>
  );
}

export default About; 