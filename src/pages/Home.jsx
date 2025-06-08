import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } },
};

const Home = () => {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    import('../config/reviews.json').then((mod) => setReviews(mod.default || mod));
  }, []);

  return (
    <motion.section
      className="flex flex-col items-center justify-center py-20 max-w-3xl w-full mx-auto text-center relative"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Animated floating background shape */}
      <motion.div
        className="absolute -top-10 -left-10 w-40 h-40 bg-pink-100 rounded-full blur-2xl opacity-40 z-0"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />
      <motion.div
        className="w-24 h-24 rounded-full bg-gradient-to-tr from-white via-pink-50 to-orange-100 flex items-center justify-center mb-4 shadow-xl border border-pink-200 z-10"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        variants={itemVariants}
      >
        <img src="/logo.png" alt="TandavaLasya Logo" className="w-24 h-24 object-cover drop-shadow-md" />
      </motion.div>
      <motion.h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg z-10" variants={itemVariants}>
        TandavaLasya
      </motion.h1>
      <motion.h2 className="text-xl md:text-2xl font-semibold mb-6 text-pink-700 z-10" variants={itemVariants}>
        Bharatanatyam Dance School
      </motion.h2>
      {/* Short summary */}
      <motion.p className="max-w-2xl text-lg md:text-xl mb-6 text-gray-700 z-10" variants={itemVariants}>
        Welcome to TandavaLasya, where tradition meets innovation. Led by <span className="font-bold text-pink-600">Bhargavi Venkataraman</span>, MFA (Bharatanatyam), Grade B Doordarshan artist, and award-winning performer, our school inspires students of all ages to discover the joy and discipline of Bharatanatyam.
      </motion.p>
      {/* Why Choose Us */}
      <motion.div className="bg-white/80 rounded-xl shadow p-4 flex-1 min-w-[220px] mb-8" variants={itemVariants}>
        <div className="text-orange-600 font-bold text-lg mb-1">Why Choose Us?</div>
        <ul className="text-left text-gray-700 text-sm list-disc list-inside">
          <li>Expert, passionate instructors</li>
          <li>Blend of tradition and creativity</li>
          <li>Personalized attention for every student</li>
          <li>Performances, workshops, and community events</li>
        </ul>
      </motion.div>
      {/* Notable Highlights */}
      <motion.div className="bg-white/80 rounded-xl shadow p-4 flex-1 min-w-[220px] mb-8" variants={itemVariants}>
        <div className="text-pink-600 font-bold text-lg mb-1">Notable Highlights</div>
        <ul className="text-left text-gray-700 text-sm list-disc list-inside">
          <li>Guinness World Record participant (Largest Bharatanatyam lesson)</li>
          <li>1000th year celebration, Tanjore Brihadeeswarar Temple</li>
          <li>Best Performer 2016, Sri Parthasarathy Swami Sabha</li>
          <li>Major festivals & sabhas across India</li>
        </ul>
      </motion.div>
      {/* Call to Action */}
      <motion.div className="flex gap-4 justify-center z-10 mb-8" variants={itemVariants}>
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>
          <Link to="/about" className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-full shadow-lg hover:from-orange-400 hover:to-pink-500 transition-transform duration-300">Meet Our Instructors</Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>
          <Link to="/gallery" className="inline-block px-8 py-3 bg-white/80 text-pink-600 font-bold rounded-full shadow hover:bg-pink-50 transition-colors duration-300">Explore Gallery</Link>
        </motion.div>
      </motion.div>
      {/* Reviews Section */}
      <motion.div className="w-full max-w-2xl mx-auto mt-8" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h3 className="text-2xl font-bold text-orange-600 mb-6">What Our Students Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              className="bg-white rounded-xl shadow p-5 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              {review.image && <img src={review.image} alt={review.name} className="w-14 h-14 rounded-full object-cover mb-2 border-2 border-pink-200" />}
              <div className="font-semibold text-pink-700 mb-1">{review.name}</div>
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, idx) => (
                  <span key={idx} className={idx < review.rating ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>★</span>
                ))}
              </div>
              <div className="text-gray-700 text-sm">{review.review}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Home; 
