import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const About = () => {
  const [instructors, setInstructors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    import('../config/instructors.json').then((mod) => setInstructors(mod.default || mod));
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-white py-16 px-4 flex flex-col items-center overflow-x-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-30 z-0" />
      <div className="absolute -bottom-24 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30 z-0" />
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-pink-700 mb-10 text-center z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Meet Our Instructors
      </motion.h1>
      <div className="w-full max-w-6xl flex flex-wrap justify-center gap-12 z-10">
        {instructors.map((inst, i) => (
          <motion.div
            key={inst.id}
            className="bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center cursor-pointer hover:shadow-3xl hover:scale-105 transition-all duration-300 min-w-[320px] max-w-[340px] mx-2 mb-8 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.7 }}
            whileHover={{ scale: 1.07 }}
            onClick={() => navigate(`/instructor/${inst.id}`)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${inst.name}`}
          >
            <img src={inst.image} alt={inst.name} className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-pink-100 shadow-lg" />
            <div className="font-bold text-xl text-pink-700 mb-1">{inst.name}</div>
            <div className="text-pink-500 text-base mb-2">{inst.title}</div>
            <div className="text-gray-700 text-base text-center mb-2">
              <ReactMarkdown>{inst.shortBio}</ReactMarkdown>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default About; 