import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
    <p className="max-w-xl text-lg md:text-xl mb-6 text-gray-700">Led by <span className="font-bold text-pink-600">Bhargavi Venkataraman</span>, MFA (Bharatanatyam), Grade B Doordarshan artist, and award-winning performer.<br/>Experience the grace, tradition, and joy of Bharatanatyam in a vibrant, modern setting.</p>
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="bg-white/80 rounded-xl shadow p-4 flex-1 min-w-[220px]">
        <div className="text-pink-600 font-bold text-lg mb-1">Notable Highlights</div>
        <ul className="text-left text-gray-700 text-sm list-disc list-inside">
          <li>Guinness World Record participant (Largest Bharatanatyam lesson)</li>
          <li>1000th year celebration, Tanjore Brihadeeswarar Temple</li>
          <li>Best Performer 2016, Sri Parthasarathy Swami Sabha</li>
          <li>Major festivals & sabhas across India</li>
        </ul>
      </div>
    </div>
    <div className="flex gap-4 justify-center">
      <Link to="/about" className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:from-orange-400 hover:to-pink-500 transition-transform duration-300">Learn More</Link>
      <Link to="/gallery" className="inline-block px-8 py-3 bg-white/80 text-pink-600 font-bold rounded-full shadow hover:bg-pink-50 transition-colors duration-300">Explore Gallery</Link>
    </div>
  </motion.section>
);

export default Home; 
