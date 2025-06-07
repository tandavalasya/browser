import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = ["Events", "Student Performances", "Workshops"];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } },
};

const Gallery = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <section className="max-w-5xl mx-auto py-12 px-2 sm:px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-pink-700">Gallery</h2>
      <div className="flex justify-center mb-8 gap-4">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${activeTab === idx ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="aspect-square bg-gradient-to-tr from-orange-200 to-pink-200 rounded-xl flex items-center justify-center text-2xl font-bold text-pink-500 shadow-md"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              exit={{ opacity: 0, y: 30 }}
            >
              Media {i + 1}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <p className="mt-8 text-center text-gray-500">(Your event photos and videos will appear here!)</p>
    </section>
  );
};

export default Gallery; 