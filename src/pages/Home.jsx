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

const ReviewTile = ({ review }) => {
  if (!review) {
    console.error('ReviewTile received null or undefined review');
    return null;
  }

  const {
    author = 'Anonymous',
    rating = 5,
    text = '',
    date = new Date().toISOString(),
    profilePhoto = null,
    source = 'site'
  } = review;

  // Format the date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center mb-4">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={author}
            className="w-12 h-12 rounded-full mr-4"
            onError={(e) => {
              console.error('Error loading profile photo:', e);
              e.target.src = '/default-avatar.png';
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
            <span className="text-gray-500 text-lg">
              {author.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900">{author}</h3>
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">{formattedDate}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 flex-grow">{text}</p>
      {source === 'google' && (
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3a7 7 0 100 14 7 7 0 000-14zm0 2a5 5 0 110 10 5 5 0 010-10z" />
          </svg>
          Google Review
        </div>
      )}
    </div>
  );
};

const ReviewsSection = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  
  // Calculate reviews per page based on screen width
  const getReviewsPerPage = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [reviewsPerPage, setReviewsPerPage] = useState(getReviewsPerPage());
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  // Update reviews per page on window resize
  useEffect(() => {
    const handleResize = () => {
      setReviewsPerPage(getReviewsPerPage());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No reviews available</p>
      </div>
    );
  }

  // Calculate the current set of reviews to display
  const startIndex = currentIndex * reviewsPerPage;
  const visibleReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  return (
    <div className="relative max-w-7xl mx-auto px-4">
      {/* Reviews Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleReviews.map((review) => (
          <ReviewTile key={review.id} review={review} />
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center mt-8 gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`p-2 rounded-full bg-white shadow-lg transition-colors ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
          aria-label="Previous review"
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
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to review page ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === totalPages - 1}
          className={`p-2 rounded-full bg-white shadow-lg transition-colors ${
            currentIndex === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
          aria-label="Next review"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
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
    try {
      // Transform site reviews with proper field mapping
      const transformedSiteReviews = (siteReviews || []).map(review => ({
        id: `site-${review.id}`,
        source: 'site',
        author: review.authorName || 'Student',
        rating: review.rating || 5,
        text: review.reviewText || '',
        date: review.reviewDate || new Date().toISOString(),
        profilePhoto: null
      }));

      // Transform Google reviews
      const transformedGoogleReviews = (googleReviews?.reviews || []).map(review => ({
        id: review.id,
        source: 'google',
        author: review.author || 'Google User',
        rating: review.rating || 5,
        text: review.text || '',
        date: review.date || new Date().toISOString(),
        profilePhoto: review.profilePhoto || null
      }));

      // Combine all reviews
      const allReviews = [...transformedSiteReviews, ...transformedGoogleReviews];

      // Remove duplicates using a Map (keeping the first occurrence)
      const uniqueReviews = Array.from(
        new Map(allReviews.map(review => [review.id, review])).values()
      );

      // Sort by date, most recent first
      return uniqueReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error transforming reviews:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch Google reviews
        const googleReviewsData = await fetchGoogleReviews();
        
        // Transform and combine all reviews
        const combinedReviews = transformReviews(siteReviews, googleReviewsData);
        
        // Update state with combined reviews
        setAllReviews(combinedReviews);
        
        // Log review counts for debugging
        console.error('Review counts:', {
          total: combinedReviews.length,
          site: siteReviews.length,
          google: googleReviewsData?.reviews?.length || 0
        });

      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews. Please try again later.');
        // Fallback to site reviews only
        setAllReviews(transformReviews(siteReviews, null));
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [siteReviews, transformReviews]);

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
            <ReviewsSection reviews={allReviews} />
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
