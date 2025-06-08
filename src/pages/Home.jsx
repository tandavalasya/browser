/**
 * Home Page Component
 * 
 * Main landing page for the TandavaLasya application.
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
 * - Hero section with call-to-action
 * - Reviews carousel with Google integration
 * - Class highlights and instructor showcase
 * - Responsive design with accessibility compliance
 * - Comprehensive logging and error handling
 * 
 * @version 2.0.0
 * @author TandavaLasya Development Team
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Core utilities and services
import { Logger } from '../core/utils/logger.util.js';
import { ErrorHandler } from '../core/utils/error-handler.util.js';

// UI Components
import { ErrorBoundary } from '../components/ui/ErrorBoundary/ErrorBoundary.jsx';
import { 
  AnimationWrapper, 
  StaggerContainer, 
  StaggerItem 
} from '../components/ui/Animation/AnimationWrapper.jsx';

// Configuration and constants
import { APP_CONSTANTS } from '../core/constants/app.constants.js';

// Local data
import instructorsData from '../config/instructors.json';
import reviewsData from '../config/reviews.json';

// Initialize services
const logger = new Logger('Home');
const errorHandler = new ErrorHandler();

/**
 * Hero Section Component
 * Displays the main hero content with call-to-action
 * 
 * @returns {JSX.Element} Hero section
 */
function HeroSection() {
  const handleCTAClick = (action) => {
    logger.info('Hero CTA clicked', {
      action,
      timestamp: new Date().toISOString(),
      page: 'home'
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <AnimationWrapper variant="fadeIn">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              TandavaLasya
            </span>
          </motion.h1>
        </AnimationWrapper>

        <AnimationWrapper variant="fadeIn" motionProps={{ transition: { delay: 0.4 } }}>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            Discover the divine art of Bharatanatyam through traditional teaching 
            and contemporary expression. Join our community of passionate dancers.
          </p>
        </AnimationWrapper>

        <AnimationWrapper variant="fadeIn" motionProps={{ transition: { delay: 0.6 } }}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/schedule"
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={() => handleCTAClick('view-classes')}
            >
              View Classes
            </Link>
            <Link
              to="/contact"
              className="border-2 border-pink-600 text-pink-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-pink-600 hover:text-white transition-all duration-300"
              onClick={() => handleCTAClick('contact-us')}
            >
              Contact Us
            </Link>
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
}

/**
 * Review Card Component
 * Displays individual review with proper error handling
 * 
 * @param {Object} props - Component props
 * @param {Object} props.review - Review data
 * @returns {JSX.Element} Review card
 */
function ReviewCard({ review }) {
  if (!review) {
    logger.warn('ReviewCard received null review');
    return null;
  }

  const {
    name = 'Anonymous',
    author = name,
    rating = 5,
    review: text = '',
    text: fallbackText = text,
    date = new Date().toISOString(),
    image: profilePhoto = null,
    profilePhoto: fallbackPhoto = profilePhoto,
    source = 'site'
  } = review;

  // Use the correct properties from our data structure
  const displayName = name || author || 'Anonymous';
  const displayText = text || fallbackText || '';
  const displayPhoto = profilePhoto || fallbackPhoto;

  const formattedDate = useMemo(() => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      logger.warn('Error formatting review date', { date, error: error.message });
      return 'Recent';
    }
  }, [date]);

  const handleImageError = useCallback((e) => {
    logger.warn('Review profile photo failed to load', { 
      author: displayName, 
      originalSrc: e.target.src 
    });
    e.target.style.display = 'none';
  }, [displayName]);

  return (
    <AnimationWrapper variant="scale">
      <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
        {/* Review Header */}
        <div className="flex items-center mb-4">
          {displayPhoto ? (
            <img
              src={displayPhoto}
              alt={`${displayName}'s profile`}
              className="w-12 h-12 rounded-full mr-4 object-cover"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 mr-4 flex items-center justify-center">
              <span className="text-pink-700 text-lg font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{displayName}</h3>
            <div className="flex items-center gap-2">
              {/* Star Rating */}
              <div className="flex text-yellow-400" aria-label={`${rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Review Content */}
        <p className="text-gray-700 flex-grow leading-relaxed">{displayText}</p>

        {/* Review Source */}
        {source === 'google' && (
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 17.965c-3.272 0-5.929-2.657-5.929-5.929s2.657-5.929 5.929-5.929c1.6 0 2.929.587 3.909 1.728l-1.591 1.591c-.434-.434-1.18-.93-2.318-.93-1.99 0-3.616 1.649-3.616 3.673s1.626 3.673 3.616 3.673c2.318 0 3.185-1.661 3.318-2.52h-3.318v-2.013h5.486c.055.3.09.6.09.991-.001 3.426-2.294 5.665-5.576 5.665z"/>
            </svg>
            Google Review
          </div>
        )}
      </div>
    </AnimationWrapper>
  );
}

/**
 * Reviews Carousel Component
 * Displays reviews in a responsive carousel format
 * 
 * @param {Object} props - Component props
 * @param {Array} props.reviews - Array of review objects
 * @returns {JSX.Element} Reviews carousel
 */
function ReviewsCarousel({ reviews }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(3);

  // Calculate reviews per page based on screen width
  const calculateReviewsPerPage = useCallback(() => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }, []);

  // Update reviews per page on window resize
  useEffect(() => {
    const updateReviewsPerPage = () => {
      setReviewsPerPage(calculateReviewsPerPage());
    };

    updateReviewsPerPage();
    window.addEventListener('resize', updateReviewsPerPage);
    return () => window.removeEventListener('resize', updateReviewsPerPage);
  }, [calculateReviewsPerPage]);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const visibleReviews = useMemo(() => {
    const startIndex = currentIndex * reviewsPerPage;
    return reviews.slice(startIndex, startIndex + reviewsPerPage);
  }, [reviews, currentIndex, reviewsPerPage]);

  const handleNavigation = useCallback((direction) => {
    setCurrentIndex(prev => {
      const newIndex = direction === 'next' 
        ? (prev + 1) % totalPages 
        : (prev - 1 + totalPages) % totalPages;
      
      logger.debug('Reviews carousel navigation', {
        direction,
        previousIndex: prev,
        newIndex,
        totalPages
      });
      
      return newIndex;
    });
  }, [totalPages]);

  const handleDotClick = useCallback((index) => {
    setCurrentIndex(index);
    logger.debug('Reviews carousel dot clicked', { index });
  }, []);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No reviews available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Reviews Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {visibleReviews.map((review, index) => (
          <ReviewCard key={review.id || index} review={review} />
        ))}
      </div>

      {/* Navigation Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => handleNavigation('prev')}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full bg-white shadow-lg transition-all duration-200 ${
              currentIndex === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50 hover:shadow-xl'
            }`}
            aria-label="Previous reviews"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Pagination Dots */}
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentIndex === index 
                    ? 'bg-pink-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to review page ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => handleNavigation('next')}
            disabled={currentIndex === totalPages - 1}
            className={`p-3 rounded-full bg-white shadow-lg transition-all duration-200 ${
              currentIndex === totalPages - 1 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50 hover:shadow-xl'
            }`}
            aria-label="Next reviews"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Reviews Section Component
 * Manages review data loading and display
 * 
 * @returns {JSX.Element} Reviews section
 */
function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        logger.info('Loading reviews for home page');
        setLoading(true);
        setError(null);

        // Start with local reviews as fallback
        let allReviews = [...reviewsData];

        // Try to fetch Google reviews with increased timeout
        try {
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Google Places API timeout')), 5000)
          );

          const googlePromise = (async () => {
            const { GooglePlacesService } = await import('../services/google-places.service.js');
            const googlePlacesService = new GooglePlacesService();
            return await googlePlacesService.fetchReviews();
          })();

          const googleData = await Promise.race([googlePromise, timeoutPromise]);
          
          if (googleData && googleData.reviews && googleData.reviews.length > 0) {
            // Add Google reviews to the beginning (most recent)
            allReviews = [...googleData.reviews, ...allReviews];
            logger.info('Successfully loaded Google reviews', { 
              count: googleData.reviews.length,
              totalCount: allReviews.length,
              sampleGoogleReview: googleData.reviews[0] ? {
                name: googleData.reviews[0].name,
                author: googleData.reviews[0].author,
                review: googleData.reviews[0].review,
                text: googleData.reviews[0].text,
                rating: googleData.reviews[0].rating,
                source: googleData.reviews[0].source
              } : null
            });
            
            // Debug: Log all reviewer names to console
            console.log('Google reviews data:', googleData.reviews.map(r => ({
              name: r.name,
              author: r.author,
              hasName: !!r.name,
              hasAuthor: !!r.author,
              actualName: r.name || r.author,
              source: r.source
            })));
          } else {
            logger.info('No Google reviews found, using local reviews only');
          }
        } catch (googleError) {
          // Log but don't fail - graceful degradation
          logger.warn('Failed to load Google reviews, using local reviews only', {
            error: googleError.message,
            stack: googleError.stack
          });
        }

        // Sort reviews by date (newest first)
        allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        setReviews(allReviews);
        logger.info('Reviews loaded successfully', { 
          totalCount: allReviews.length,
          localCount: reviewsData.length
        });

      } catch (error) {
        const handledError = errorHandler.handle(error, 'Reviews Loading');
        setError(handledError.message);
        logger.error('Failed to load reviews', handledError);
        
        // Fallback to local reviews only
        setReviews(reviewsData);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 h-64">
                  <div className="animate-pulse">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded"></div>
                      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-300 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <AnimationWrapper variant="fadeIn">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from our community of passionate dancers about their journey with TandavaLasya
            </p>
          </div>
        </AnimationWrapper>

        <ErrorBoundary
          context="Reviews Carousel"
          fallback={(error) => {
            logger.error('Reviews carousel error', { error });
            return (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  Unable to load reviews at the moment. Please try again later.
                </p>
              </div>
            );
          }}
        >
          <ReviewsCarousel reviews={reviews} />
        </ErrorBoundary>

        {error && (
          <div className="text-center mt-8">
            <p className="text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-4 inline-block">
              Some reviews may not be available. Showing cached reviews.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Classes Highlight Section
 * Showcases featured classes and programs
 * 
 * @returns {JSX.Element} Classes highlight section
 */
function ClassesHighlight() {
  const classes = [
    {
      title: 'Beginner Classes',
      description: 'Perfect for those new to Bharatanatyam. Learn basic positions, movements, and cultural context.',
      image: '/images/beginner-class.jpg',
      link: '/schedule#beginner'
    },
    {
      title: 'Intermediate Training',
      description: 'Advance your skills with complex choreography and deeper understanding of the art form.',
      image: '/images/intermediate-class.jpg',
      link: '/schedule#intermediate'
    },
    {
      title: 'Performance Preparation',
      description: 'Intensive training for students preparing for performances and competitive showcases.',
      image: '/images/performance-class.jpg',
      link: '/schedule#performance'
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <AnimationWrapper variant="fadeIn">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Classes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Structured programs designed to nurture your dance journey from beginner to advanced levels
            </p>
          </div>
        </AnimationWrapper>

        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {classes.map((classItem, index) => (
              <StaggerItem key={classItem.title}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <span className="text-6xl">💃</span>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {classItem.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                      {classItem.description}
                    </p>
                    <Link
                      to={classItem.link}
                      className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 transition-colors mt-auto"
                    >
                      Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
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
 * Main Home Page Component
 * Orchestrates all home page sections with proper error boundaries
 * 
 * @returns {JSX.Element} Complete home page
 */
function Home() {
  useEffect(() => {
    logger.info('Home page mounted', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });

    return () => {
      logger.debug('Home page unmounted');
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ErrorBoundary
        context="Hero Section"
        fallback={(error) => {
          logger.error('Hero section error', { error });
          return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to TandavaLasya</h1>
                <p className="text-xl text-gray-600">Discover the art of Bharatanatyam</p>
              </div>
            </div>
          );
        }}
      >
        <HeroSection />
      </ErrorBoundary>

      {/* Reviews Section */}
      <ErrorBoundary
        context="Reviews Section"
        fallback={(error) => {
          logger.error('Reviews section error', { error });
          return null; // Graceful degradation - page works without reviews
        }}
      >
        <ReviewsSection />
      </ErrorBoundary>

      {/* Classes Highlight */}
      <ErrorBoundary
        context="Classes Highlight"
        fallback={(error) => {
          logger.error('Classes highlight error', { error });
          return (
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Classes</h2>
                <p className="text-gray-600">Class information temporarily unavailable.</p>
              </div>
            </section>
          );
        }}
      >
        <ClassesHighlight />
      </ErrorBoundary>
    </div>
  );
}

export default Home; 
