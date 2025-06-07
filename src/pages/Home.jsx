import React from 'react';
import { motion } from 'framer-motion';

const Home = () => (
  <motion.section
    className="flex flex-col items-center justify-center py-20 px-4 text-center"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
  >
    <motion.div
      className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400 to-orange-400 flex items-center justify-center text-white font-extrabold text-4xl mb-4 shadow-xl"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      TL
    </motion.div>
    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">TandavaLasya</h1>
    <h2 className="text-xl md:text-2xl font-semibold mb-6 text-pink-700">Bharatanatyam Dance School</h2>
    <p className="max-w-xl text-lg md:text-xl mb-8 text-gray-700">Experience the grace, tradition, and joy of Bharatanatyam. Join our vibrant community and let your dance journey begin!</p>
    <a href="/gallery" className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:from-orange-400 hover:to-pink-500 transition-transform duration-300">Explore Gallery</a>
  </motion.section>
);

export default Home; 