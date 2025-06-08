import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaGoogle } from 'react-icons/fa';
import { fetchGoogleReviews } from '../services/googlePlacesService';
import { AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } },
};

const staggeredList = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const staggeredItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 60 } },
};

const ReviewTile = ({ review, placeId }) => {
  const isGoogleReview = review.source === 'google';
  const authorName = isGoogleReview ? review.author : review.authorName;
  const reviewText = isGoogleReview ? review.text : review.reviewText;
  const reviewDate = isGoogleReview ? new Date(review.date) : new Date(review.reviewDate);
  const profilePhoto = isGoogleReview ? review.profilePhoto : review.profilePhotoUrl;
  const rating = review.rating || 5;

  if (!authorName || !reviewText) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl p-6 flex flex-col w-[300px] flex-shrink-0 relative hover:scale-105 transition-transform duration-300 ${
        isGoogleReview ? 'border-2 border-blue-100' : ''
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-200 shadow">
          <span className="text-pink-500 text-lg font-semibold">
            {authorName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-pink-700 text-base">{authorName}</h3>
            {isGoogleReview && placeId && (
              <a 
                href={`https://www.google.com/maps/place/?q=place_id:${placeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors"
                title="View on Google"
              >
                <FaGoogle size={14} />
              </a>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-700 text-base leading-relaxed mb-4 flex-1">
        {reviewText}
      </p>
      <div className="text-sm text-gray-400 mt-auto">
        {reviewDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong loading the reviews.</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const Home = () => {
  const [siteReviews, setSiteReviews] = useState([]);
  const [googleReviews, setGoogleReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placeConfig, setPlaceConfig] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const carouselRef = useRef(null);
  const autoScrollRef = useRef(null);
  const isManualNavigation = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [siteMod, config] = await Promise.all([
          import('../config/reviews.json'),
          import('../config/googlePlaces.json')
        ]);

        if (!isMounted) return;

        // Transform site reviews to match our format
        const siteReviewsWithSource = (siteMod.default || siteMod).map((review, index) => ({
          id: `site-${index}`,
          source: 'site',
          authorName: review.name || 'Anonymous',
          reviewText: review.review || '',
          rating: review.rating || 5,
          reviewDate: review.date || new Date().toISOString(),
          profilePhotoUrl: review.image || null
        }));

        // Temporary logging to debug site reviews
        console.log('Site Reviews:', {
          totalReviews: siteReviewsWithSource.length,
          sampleReview: siteReviewsWithSource[0]
        });

        setSiteReviews(siteReviewsWithSource);
        setPlaceConfig(config.default);

        try {
          const googleReviewsData = await fetchGoogleReviews();
          // Temporary logging to debug Google reviews
          console.log('Google Reviews Data:', {
            totalReviews: googleReviewsData?.reviews?.length || 0,
            sampleReview: googleReviewsData?.reviews?.[0],
            rating: googleReviewsData?.rating
          });

          if (isMounted && googleReviewsData?.reviews) {
            setGoogleReviews(googleReviewsData.reviews);
          }
        } catch (googleError) {
          console.error('Error loading Google reviews:', googleError);
          if (isMounted) {
            setGoogleReviews([]);
          }
        }
      } catch (err) {
        console.error('Error loading reviews:', err);
        if (isMounted) {
          setError('Unable to load reviews. Please try again later.');
          setGoogleReviews([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  // Transform and combine reviews
  const transformReviews = useCallback((siteReviews, googleReviews) => {
    // Transform site reviews
    const transformedSiteReviews = siteReviews.map(review => ({
      ...review,
      id: `site-${review.id}`,
      source: 'site',
      date: review.date || new Date().toISOString()
    }));

    // Transform Google reviews and ensure uniqueness
    const transformedGoogleReviews = (googleReviews?.reviews || []).map(review => ({
      ...review,
      id: review.id || `google-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source: 'google'
    }));

    // Combine and deduplicate reviews
    const allReviews = [...transformedSiteReviews, ...transformedGoogleReviews];
    const uniqueReviews = Array.from(
      new Map(allReviews.map(review => [review.id, review])).values()
    );

    // Sort by date, most recent first
    return uniqueReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch Google reviews
        let transformedGoogleReviews = [];
        try {
          const googleReviewsData = await fetchGoogleReviews();
          if (googleReviewsData && googleReviewsData.reviews) {
            transformedGoogleReviews = googleReviewsData.reviews.map(review => ({
              ...review,
              id: `google-${review.date}`,
              source: 'google'
            }));
          }
        } catch (googleError) {
          console.error('Failed to load Google reviews:', googleError);
          setError(`Failed to load Google reviews: ${googleError.message}`);
          // Continue with site reviews even if Google reviews fail
        }

        // Combine and sort reviews
        const combined = [...siteReviews, ...transformedGoogleReviews]
          .sort((a, b) => new Date(b.date || b.reviewDate) - new Date(a.date || a.reviewDate));

        setAllReviews(combined);
      } catch (err) {
        console.error('Error in fetchReviews:', err);
        setError(err.message || 'Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Temporary logging to debug combined reviews
  useEffect(() => {
    console.log('Combined Reviews:', {
      totalReviews: allReviews.length,
      siteReviews: siteReviews.length,
      googleReviews: googleReviews.length,
      sampleReviews: allReviews.slice(0, 2)
    });
  }, [allReviews, siteReviews, googleReviews]);

  useEffect(() => {
    if (allReviews.length > 0 && !isLoading && !isManualNavigation.current) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % allReviews.length);
      }, 5000);

      autoScrollRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [allReviews, isLoading]);

  useEffect(() => {
    if (carouselRef.current) {
      const tileWidth = 316; // 300px width + 16px gap
      carouselRef.current.style.transform = `translateX(-${currentIndex * tileWidth}px)`;
    }
  }, [currentIndex]);

  const handlePrevious = () => {
    isManualNavigation.current = true;
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    setCurrentIndex(prev => (prev - 1 + allReviews.length) % allReviews.length);
  };

  const handleNext = () => {
    isManualNavigation.current = true;
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    setCurrentIndex(prev => (prev + 1) % allReviews.length);
  };

  const handleDotClick = (index) => {
    isManualNavigation.current = true;
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    setCurrentIndex(index);
  };

  return (
    <div className="relative flex flex-col w-full pb-20">
      {/* Subtle floating background shapes, not covering floating elements */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-pink-100 rounded-full blur-2xl opacity-20 z-0 pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-80 h-80 bg-orange-100 rounded-full blur-2xl opacity-20 z-0 pointer-events-none" />
      {/* Hero Section */}
      <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 pt-8 pb-8 z-10">
        <motion.div
          className="w-28 h-28 aspect-square flex-shrink-0 rounded-full bg-gradient-to-tr from-white via-pink-50 to-orange-100 flex items-center justify-center shadow-xl border-2 border-pink-200 z-10 mx-auto md:mx-0"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <img src="/logo.png" alt="TandavaLasya Logo" className="w-20 h-20 aspect-square rounded-full object-cover drop-shadow-md" />
        </motion.div>
        <div className="flex flex-col justify-center w-full">
          <motion.h1 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-lg z-10 text-pink-700 text-center md:text-left" variants={itemVariants}>
            TandavaLasya
          </motion.h1>
          <motion.h2 className="text-lg md:text-2xl font-semibold mb-4 text-orange-600 z-10 text-center md:text-left" variants={itemVariants}>
            Bharatanatyam Dance School
          </motion.h2>
          <motion.p className="max-w-2xl text-base md:text-lg mb-6 text-gray-700 z-10 text-center md:text-left mx-auto md:mx-0" variants={itemVariants}>
            Welcome to TandavaLasya, where tradition meets innovation. Led by <span className="font-bold text-pink-600">Bhargavi Venkataraman</span>, MFA (Bharatanatyam), Grade B Doordarshan artist, and award-winning performer, our school inspires students of all ages to discover the joy and discipline of Bharatanatyam.
          </motion.p>
          {/* CTA Buttons */}
          <motion.div className="flex flex-row gap-4 z-10 mt-2 mb-2 justify-center md:justify-start" variants={itemVariants}>
            <Link to="/about" className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-full shadow-lg hover:from-orange-400 hover:to-pink-500 transition-transform duration-300 text-base">Learn More About Us</Link>
            <Link to="/gallery" className="inline-block px-6 py-3 bg-white/80 text-pink-600 font-bold rounded-full shadow hover:bg-pink-50 transition-colors duration-300 text-base">Explore Gallery</Link>
          </motion.div>
        </div>
      </div>
      {/* Why Choose Us - no box, just staggered points */}
      <motion.div className="w-full max-w-3xl mx-auto mb-10 z-10">
        <motion.div className="text-orange-600 font-bold text-lg mb-2 text-left">Why Choose Us?</motion.div>
        <motion.ul className="w-full flex flex-col gap-3 text-left" variants={staggeredList} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {[
            'Rooted in the rich tradition of Bharatanatyam, with a modern, creative approach',
            'Holistic focus: dance technique, health, fitness, and flexibility',
            'Classes include dynamic warm-ups, stretches, and strength-building routines',
            'Emphasis on discipline, self-expression, and joy in learning',
            'Supportive, inclusive community for all ages and backgrounds',
            'Performance opportunities, workshops, and cultural events',
            'Guidance for personal growth, confidence, and lifelong wellness',
          ].map((point, idx) => (
            <motion.li key={point} className="text-base md:text-lg text-gray-700 flex items-start gap-3" variants={staggeredItem}>
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-orange-400 mt-2 flex-shrink-0 animate-pulse" />
              <span>{point}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
      {/* Reviews Carousel */}
      <div className="reviews-section py-12 px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-8 text-center">
          What Our Students Say
        </h2>
        <ErrorBoundary>
          {error ? (
            <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
              {error}
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <div className="relative max-w-7xl mx-auto">
              <div className="reviews-carousel overflow-hidden">
                <div
                  ref={carouselRef}
                  className="flex gap-4 transition-transform duration-500 ease-in-out"
                  style={{ willChange: 'transform' }}
                >
                  {allReviews.map((review) => (
                    <ReviewTile 
                      key={review.id} 
                      review={review} 
                      placeId={placeConfig?.placeId}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 mt-8">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handlePrevious}
                    className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
                    aria-label="Previous review"
                  >
                    <FaChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
                    aria-label="Next review"
                  >
                    <FaChevronRight size={20} />
                  </button>
                </div>
                {allReviews.length > 0 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {allReviews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-pink-500' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to review ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </ErrorBoundary>
      </div>
      {/* Call to Action */}
      <motion.div className="w-full max-w-3xl mx-auto flex flex-col mb-8 z-10" initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVariants}>
        <motion.h3 className="text-lg md:text-xl font-bold text-pink-700 mb-2 text-left" variants={itemVariants}>Join Us</motion.h3>
        <motion.p className="text-base md:text-lg text-gray-700 mb-4 text-left" variants={itemVariants}>
          Whether you are a beginner or an experienced dancer, TandavaLasya welcomes you to join our vibrant community. Experience the grace, tradition, and joy of Bharatanatyam in a supportive and inspiring environment.
        </motion.p>
        <Link to="/contact" className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-full shadow-lg hover:from-orange-400 hover:to-pink-500 transition-transform duration-300 text-base">Get Started</Link>
      </motion.div>
    </div>
  );
};

export default Home; 
