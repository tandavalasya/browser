import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaGoogle } from 'react-icons/fa';
import fetchGoogleReviews from '../services/googlePlaces';
import { GOOGLE_PLACES_CONFIG } from '../config/googlePlaces';

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

const Home = () => {
  const [siteReviews, setSiteReviews] = useState([]);
  const [googleReviews, setGoogleReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load both types of reviews in parallel
        const [siteMod, googleReviewsData] = await Promise.all([
          import('../config/reviews.json'),
          fetchGoogleReviews()
        ]);

        setSiteReviews(siteMod.default || siteMod);
        setGoogleReviews(googleReviewsData);
      } catch (err) {
        console.error('Error loading reviews:', err);
        setError('Unable to load reviews. Please try again later.');
        // Still load site reviews even if Google reviews fail
        const siteMod = await import('../config/reviews.json');
        setSiteReviews(siteMod.default || siteMod);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  // Combine both types of reviews
  const allReviews = [...siteReviews, ...googleReviews];

  // Auto-scroll logic
  useEffect(() => {
    if (allReviews.length <= 1) return;
    let index = currentIndex;
    const interval = setInterval(() => {
      index = (index + 1) % allReviews.length;
      setCurrentIndex(index);
    }, 3500);
    return () => clearInterval(interval);
  }, [allReviews, currentIndex]);

  useEffect(() => {
    controls.start({ x: -currentIndex * 340 });
  }, [currentIndex, controls]);

  const goTo = (idx) => setCurrentIndex(idx);
  const prev = () => setCurrentIndex((prev) => (prev === 0 ? allReviews.length - 1 : prev - 1));
  const next = () => setCurrentIndex((prev) => (prev === allReviews.length - 1 ? 0 : prev + 1));

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
      <motion.div className="w-full max-w-4xl mx-auto mt-8 mb-16 relative z-20 overflow-x-hidden">
        <h3 className="text-lg md:text-xl font-bold text-orange-600 mb-4 text-left">What Our Students Say</h3>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {/* Carousel Arrows */}
            {allReviews.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-pink-100 text-pink-600 rounded-full p-2 shadow transition-all"><FaChevronLeft size={22} /></button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-pink-100 text-pink-600 rounded-full p-2 shadow transition-all"><FaChevronRight size={22} /></button>
              </>
            )}
            <motion.div
              ref={carouselRef}
              className="flex gap-8 px-2"
              animate={controls}
              transition={{ type: 'spring', stiffness: 40, damping: 20 }}
              style={{ willChange: 'transform' }}
            >
              {allReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  className={`bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center min-w-[300px] max-w-[300px] mx-auto relative hover:scale-105 transition-transform duration-300 ${review.source === 'google' ? 'border-2 border-blue-100' : ''}`}
                  whileHover={{ scale: 1.08 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.7 }}
                >
                  {review.image && <img src={review.image} alt={review.name} className="w-14 h-14 rounded-full object-cover mb-2 border-2 border-pink-200 shadow" />}
                  <div className="font-semibold text-pink-700 mb-1 text-base flex items-center gap-2">
                    {review.name}
                    {review.source === 'google' && (
                      <a 
                        href={`https://www.google.com/maps/place/?q=place_id:${GOOGLE_PLACES_CONFIG.PLACE_ID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                        title="View on Google"
                      >
                        <FaGoogle size={14} />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(5)].map((_, idx) => (
                      <span key={idx} className={idx < review.rating ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>★</span>
                    ))}
                  </div>
                  <div className="text-gray-700 text-base leading-relaxed">{review.review}</div>
                  {review.date && (
                    <div className="text-sm text-gray-400 mt-2">
                      {new Date(review.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
            {/* Carousel Dots */}
            {allReviews.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {allReviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`w-3 h-3 rounded-full border-2 ${currentIndex === idx ? 'bg-pink-500 border-pink-500' : 'bg-white border-pink-300'} transition-all`}
                    aria-label={`Go to review ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
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
