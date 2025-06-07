import React from 'react';
import { motion } from 'framer-motion';

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const events = [
  { day: 2, title: "Beginner Class" },
  { day: 4, title: "Advanced Class" },
  { day: 6, title: "Workshop" },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } },
};

const Schedule = () => (
  <motion.section
    className="max-w-2xl mx-auto py-12 px-4"
    initial="hidden"
    animate="show"
    variants={containerVariants}
  >
    <motion.h2
      className="text-3xl font-bold mb-8 text-center text-orange-700"
      variants={itemVariants}
    >
      Schedule
    </motion.h2>
    <motion.div className="grid grid-cols-7 gap-2 mb-4" variants={itemVariants}>
      {days.map((d) => (
        <motion.div key={d} className="text-center font-semibold text-pink-600" variants={itemVariants}>{d}</motion.div>
      ))}
      {[...Array(28)].map((_, i) => {
        const event = events.find(e => e.day === (i % 7));
        return (
          <motion.div
            key={i}
            className={`h-16 flex items-center justify-center rounded-lg border ${event ? 'bg-pink-100 border-pink-400' : 'bg-white border-gray-200'}`}
            variants={itemVariants}
            whileHover={event ? { scale: 1.04, backgroundColor: '#f9a8d4' } : {}}
            whileTap={event ? { scale: 0.97 } : {}}
          >
            {event ? event.title : ''}
          </motion.div>
        );
      })}
    </motion.div>
    <motion.p className="text-center text-gray-500" variants={itemVariants}>(A full-featured calendar will appear here!)</motion.p>
    {/* Example interactive button for future use */}
    <motion.button
      className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
      whileTap={{ scale: 0.92, rotate: 2 }}
      whileHover={{ scale: 1.05 }}
      variants={itemVariants}
    >
      Add to Calendar
    </motion.button>
  </motion.section>
);

export default Schedule; 