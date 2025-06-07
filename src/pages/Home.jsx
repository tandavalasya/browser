import React from 'react';
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

const Home = () => (
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
    <motion.p className="max-w-2xl text-lg md:text-xl mb-6 text-gray-700 z-10" variants={itemVariants}>
      Led by <span className="font-bold text-pink-600">Bhargavi Venkataraman</span>, MFA (Bharatanatyam), Grade B Doordarshan artist, and award-winning performer.<br/>Experience the grace, tradition, and joy of Bharatanatyam in a vibrant, modern setting.
    </motion.p>
    <motion.div className="flex flex-col md:flex-row gap-4 mb-8 z-10" variants={itemVariants}>
      <div className="bg-white/80 rounded-xl shadow p-4 flex-1 min-w-[220px]">
        <div className="text-pink-600 font-bold text-lg mb-1">Notable Highlights</div>
        <ul className="text-left text-gray-700 text-sm list-disc list-inside">
          <li>Guinness World Record participant (Largest Bharatanatyam lesson)</li>
          <li>1000th year celebration, Tanjore Brihadeeswarar Temple</li>
          <li>Best Performer 2016, Sri Parthasarathy Swami Sabha</li>
          <li>Major festivals & sabhas across India</li>
        </ul>
      </div>
    </motion.div>
    <motion.div className="flex gap-4 justify-center z-10" variants={itemVariants}>
      <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>
        <Link to="/about" className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-full shadow-lg hover:from-orange-400 hover:to-pink-500 transition-transform duration-300">Learn More</Link>
      </motion.div>
      <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>
        <Link to="/gallery" className="inline-block px-8 py-3 bg-white/80 text-pink-600 font-bold rounded-full shadow hover:bg-pink-50 transition-colors duration-300">Explore Gallery</Link>
      </motion.div>
    </motion.div>
  </motion.section>
);

export default Home; 
