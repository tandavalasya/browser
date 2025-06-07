import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import galleryEvents from '../posts/galleryEvents';

const tabs = ["Events"];

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
      <motion.h2
        className="text-3xl font-bold mb-8 text-center text-pink-700"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        Gallery
      </motion.h2>
      <div className="flex justify-center mb-8 gap-4 relative">
        {tabs.map((tab, idx) => (
          <motion.button
            key={tab}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 relative z-10 ${activeTab === idx ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}
            onClick={() => setActiveTab(idx)}
            whileTap={{ scale: 0.95 }}
          >
            {tab}
            {activeTab === idx && (
              <motion.span
                layoutId="tab-underline"
                className="absolute left-0 right-0 bottom-0 h-1 rounded-b-full bg-gradient-to-r from-pink-400 to-orange-300"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
      <motion.div
        className="grid gap-8 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {galleryEvents.map((event) => (
            <motion.div
              key={event.slug}
              className="group bg-white rounded-xl shadow-md p-0 hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(255, 99, 132, 0.15)' }}
              whileTap={{ scale: 0.97 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <Link to={`/gallery/${event.slug}`} className="flex flex-col h-full">
                <motion.img
                  src={event.image}
                  alt={event.title}
                  className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                />
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-2 text-pink-600 group-hover:text-pink-700 transition-colors">{event.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{event.date}</p>
                  <p className="text-gray-700 mb-4 flex-1">{event.excerpt}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Gallery; 