import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const controls = useAnimation();
  useEffect(() => {
    import('../config/reviews.json').then((mod) => setReviews(mod.default || mod));
  }, []);
  // Auto-scroll logic
  useEffect(() => {
    if (reviews.length <= 1) return;
    let index = currentIndex;
    const interval = setInterval(() => {
      index = (index + 1) % reviews.length;
      setCurrentIndex(index);
    }, 3500);
    return () => clearInterval(interval);
  }, [reviews, currentIndex]);
  useEffect(() => {
    controls.start({ x: -currentIndex * 340 });
  }, [currentIndex, controls]);
  const goTo = (idx) => setCurrentIndex(idx);
  const prev = () => setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  const next = () => setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative flex flex-col items-center justify-center w-full pb-20">
      {/* Subtle floating background shapes, not covering floating elements */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-pink-100 rounded-full blur-2xl opacity-20 z-0 pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-80 h-80 bg-orange-100 rounded-full blur-2xl opacity-20 z-0 pointer-events-none" />
      {/* Hero Section */}
      <motion.div
        className="flex flex-col items-center justify-center pt-24 pb-8 w-full z-10"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div
          className="mb-4 z-10 flex flex-col md:flex-row md:items-center md:justify-start w-full"
          variants={itemVariants}
        >
          <div className="mx-auto md:mx-0 w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-white via-pink-50 to-orange-100 flex items-center justify-center shadow-xl border-2 border-pink-200"
            style={{ minWidth: '5rem', minHeight: '5rem' }}>
            <img src="/logo.png" alt="TandavaLasya Logo" className="w-16 h-16 md:w-24 md:h-24 object-cover drop-shadow-md" />
          </div>
          <div className="flex flex-col justify-center md:ml-6 md:mt-0 mt-4 text-center md:text-left w-full">
            <motion.h1 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-lg z-10 text-pink-700" variants={itemVariants}>
              TandavaLasya
            </motion.h1>
            <motion.h2 className="text-lg md:text-2xl font-semibold mb-4 text-orange-600 z-10" variants={itemVariants}>
              Bharatanatyam Dance School
            </motion.h2>
          </div>
        </motion.div>
        <motion.p className="max-w-2xl text-base md:text-lg mb-6 text-gray-700 z-10" variants={itemVariants}>
          Welcome to TandavaLasya, where tradition meets innovation. Led by <span className="font-bold text-pink-600">Bhargavi Venkataraman</span>, MFA (Bharatanatyam), Grade B Doordarshan artist, and award-winning performer, our school inspires students of all ages to discover the joy and discipline of Bharatanatyam.
        </motion.p>
        {/* CTA Buttons */}
        <motion.div className="flex flex-row gap-4 justify-center z-10 mt-2 mb-2" variants={itemVariants}>
          <Link to="/about" className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-full shadow-lg hover:from-orange-400 hover:to-pink-500 transition-transform duration-300 text-base">Meet Our Instructors</Link>
          <Link to="/gallery" className="inline-block px-6 py-3 bg-white/80 text-pink-600 font-bold rounded-full shadow hover:bg-pink-50 transition-colors duration-300 text-base">Explore Gallery</Link>
        </motion.div>
      </motion.div>
      {/* About Bhargavi / School Philosophy */}
      <motion.div className="w-full max-w-3xl mx-auto flex flex-col items-center mb-10 z-10" initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVariants}>
        <motion.h3 className="text-xl md:text-2xl font-bold text-pink-700 mb-2" variants={itemVariants}>Our Mission & Vision</motion.h3>
        <motion.p className="text-base md:text-lg text-gray-700 mb-4 text-center" variants={itemVariants}>
          At TandavaLasya, our mission is to nurture a lifelong love for Bharatanatyam by blending tradition with creativity, discipline with joy, and art with holistic well-being. We believe that dance is not just a performance, but a journey of self-discovery, health, and community.
        </motion.p>
        <motion.p className="text-base md:text-lg text-gray-700 mb-4 text-center" variants={itemVariants}>
          Our vision is to create a vibrant, inclusive space where students of all ages and backgrounds can experience the transformative power of Bharatanatyam. We are committed to fostering not only artistic excellence, but also physical fitness, mental resilience, and a deep sense of belonging.
        </motion.p>
      </motion.div>
      {/* Why Choose Us - no box, just staggered points */}
      <motion.div className="w-full max-w-3xl mx-auto flex flex-col items-center mb-10 z-10">
        <motion.div className="text-orange-600 font-bold text-lg mb-2">Why Choose Us?</motion.div>
        <motion.ul className="w-full flex flex-col gap-2" variants={staggeredList} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {[
            'Rooted in the rich tradition of Bharatanatyam, with a modern, creative approach',
            'Holistic focus: dance technique, health, fitness, and flexibility',
            'Classes include dynamic warm-ups, stretches, and strength-building routines',
            'Emphasis on discipline, self-expression, and joy in learning',
            'Supportive, inclusive community for all ages and backgrounds',
            'Performance opportunities, workshops, and cultural events',
            'Guidance for personal growth, confidence, and lifelong wellness',
          ].map((point, idx) => (
            <motion.li key={point} className="text-base md:text-lg text-gray-700 flex items-center gap-3" variants={staggeredItem}>
              <span className="inline-block w-3 h-3 rounded-full bg-pink-400 mr-2 animate-pulse" />
              {point}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
      {/* School Tenets & Philosophy */}
      <motion.div className="w-full max-w-3xl mx-auto flex flex-col items-center mb-10 z-10" initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVariants}>
        <motion.h3 className="text-xl md:text-2xl font-bold text-orange-700 mb-2" variants={itemVariants}>Our Tenets</motion.h3>
        <motion.ul className="text-base md:text-lg text-gray-700 mb-2 text-center list-disc list-inside" variants={itemVariants}>
          <li>Respect for the ancient art of Bharatanatyam, honoring its history and spiritual roots</li>
          <li>Encouraging curiosity, creativity, and innovation in every student</li>
          <li>Promoting physical health through structured warm-ups, mindful stretching, and safe technique</li>
          <li>Building mental resilience, focus, and confidence through disciplined practice</li>
          <li>Fostering a sense of community, empathy, and cultural appreciation</li>
          <li>Celebrating each dancer's unique journey and growth</li>
        </motion.ul>
      </motion.div>
      {/* Reviews Carousel - floating above a soft background */}
      <motion.div className="w-full max-w-4xl mx-auto mt-8 mb-16 relative z-20 overflow-x-hidden">
        <h3 className="text-lg md:text-xl font-bold text-orange-600 mb-4 text-center">What Our Students Say</h3>
        {/* Carousel Arrows */}
        {reviews.length > 1 && (
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
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center min-w-[300px] max-w-[300px] mx-auto relative hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.08 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.7 }}
            >
              {review.image && <img src={review.image} alt={review.name} className="w-14 h-14 rounded-full object-cover mb-2 border-2 border-pink-200 shadow" />}
              <div className="font-semibold text-pink-700 mb-1 text-base">{review.name}</div>
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, idx) => (
                  <span key={idx} className={idx < review.rating ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>★</span>
                ))}
              </div>
              <div className="text-gray-700 text-base leading-relaxed">{review.review}</div>
            </motion.div>
          ))}
        </motion.div>
        {/* Carousel Dots */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`w-3 h-3 rounded-full border-2 ${currentIndex === idx ? 'bg-pink-500 border-pink-500' : 'bg-white border-pink-300'} transition-all`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
      {/* Call to Action */}
      <motion.div className="w-full max-w-3xl mx-auto flex flex-col items-center mb-8 z-10" initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVariants}>
        <motion.h3 className="text-lg md:text-xl font-bold text-pink-700 mb-2" variants={itemVariants}>Join Us</motion.h3>
        <motion.p className="text-base md:text-lg text-gray-700 mb-4 text-center" variants={itemVariants}>
          Whether you are a beginner or an experienced dancer, TandavaLasya welcomes you to join our vibrant community. Experience the grace, tradition, and joy of Bharatanatyam in a supportive and inspiring environment.
        </motion.p>
        <Link to="/contact" className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-full shadow-lg hover:from-orange-400 hover:to-pink-500 transition-transform duration-300 text-base">Get Started</Link>
      </motion.div>
    </div>
  );
};

export default Home; 
