import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.12, duration: 0.6 },
  }),
};

const About = () => {
  const [instructors, setInstructors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    import('../config/instructors.json').then((mod) => setInstructors(mod.default || mod));
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-white py-12 px-4 flex flex-col items-center">
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-pink-700 mb-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Meet Our Instructors
      </motion.h1>
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {instructors.map((inst, i) => (
          <motion.div
            key={inst.id}
            className="bg-white/90 rounded-2xl shadow-xl p-6 flex flex-col items-center cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            onClick={() => navigate(`/instructor/${inst.id}`)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${inst.name}`}
          >
            <img src={inst.image} alt={inst.name} className="w-20 h-20 rounded-full object-cover mb-3 border-4 border-pink-100 shadow" />
            <div className="font-bold text-lg text-pink-700 mb-1">{inst.name}</div>
            <div className="text-pink-500 text-sm mb-2">{inst.title}</div>
            <div className="text-gray-700 text-sm text-center line-clamp-4">
              <ReactMarkdown>{inst.shortBio}</ReactMarkdown>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default About; 