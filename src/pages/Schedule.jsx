import React from 'react';
import { motion } from 'framer-motion';

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const events = [
  { day: 2, title: "Beginner Class" },
  { day: 4, title: "Advanced Class" },
  { day: 6, title: "Workshop" },
];

const Schedule = () => (
  <motion.section
    className="max-w-2xl mx-auto py-12 px-4"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    viewport={{ once: true }}
  >
    <h2 className="text-3xl font-bold mb-8 text-center text-orange-700">Schedule</h2>
    <div className="grid grid-cols-7 gap-2 mb-4">
      {days.map((d) => (
        <div key={d} className="text-center font-semibold text-pink-600">{d}</div>
      ))}
      {[...Array(28)].map((_, i) => {
        const event = events.find(e => e.day === (i % 7));
        return (
          <motion.div
            key={i}
            className={`h-16 flex items-center justify-center rounded-lg border ${event ? 'bg-pink-100 border-pink-400' : 'bg-white border-gray-200'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (i % 7) * 0.05 }}
            viewport={{ once: true }}
          >
            {event ? event.title : ''}
          </motion.div>
        );
      })}
    </div>
    <p className="text-center text-gray-500">(A full-featured calendar will appear here!)</p>
    {/* Example interactive button for future use */}
    <motion.button
      className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
      whileTap={{ scale: 0.92, rotate: 2 }}
    >
      Add to Calendar
    </motion.button>
  </motion.section>
);

export default Schedule; 