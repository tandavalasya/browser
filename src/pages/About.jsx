import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } },
};

const staggeredList = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const staggeredItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 60 } },
};

const About = () => {
  const [instructors, setInstructors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    import('../config/instructors.json').then((mod) => setInstructors(mod.default || mod));
  }, []);

  return (
    <section className="relative min-h-screen py-16 px-4 flex flex-col overflow-x-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-30 z-0" />
      <div className="absolute -bottom-24 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30 z-0" />
      
      {/* About TandavaLasya */}
      <motion.div className="w-full max-w-3xl mx-auto mb-16 z-10" initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVariants}>
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold text-pink-700 mb-6 text-center"
          variants={itemVariants}
        >
          About TandavaLasya
        </motion.h1>
        <motion.p
          className="text-base md:text-lg text-gray-700 mb-8 text-center"
          variants={itemVariants}
        >
          Welcome to TandavaLasya, where tradition meets innovation. Led by <span className="font-bold text-pink-600">Bhargavi Venkataraman</span>, MFA (Bharatanatyam), Grade B Doordarshan artist, and award-winning performer, our school inspires students of all ages to discover the joy and discipline of Bharatanatyam.
        </motion.p>
      </motion.div>

      {/* Mission & Vision */}
      <motion.div className="w-full max-w-3xl mx-auto mb-16 z-10" initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVariants}>
        <motion.h2 className="text-2xl md:text-3xl font-bold text-pink-700 mb-4 text-left" variants={itemVariants}>Our Mission & Vision</motion.h2>
        <motion.p className="text-base md:text-lg text-gray-700 mb-4 text-left" variants={itemVariants}>
          At TandavaLasya, our mission is to nurture a lifelong love for Bharatanatyam by blending tradition with creativity, discipline with joy, and art with holistic well-being. We believe that dance is not just a performance, but a journey of self-discovery, health, and community.
        </motion.p>
        <motion.p className="text-base md:text-lg text-gray-700 mb-4 text-left" variants={itemVariants}>
          Our vision is to create a vibrant, inclusive space where students of all ages and backgrounds can experience the transformative power of Bharatanatyam. We are committed to fostering not only artistic excellence, but also physical fitness, mental resilience, and a deep sense of belonging.
        </motion.p>
      </motion.div>

      {/* Our Tenets */}
      <motion.div className="w-full max-w-3xl mx-auto mb-16 z-10" initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVariants}>
        <motion.h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-4 text-left" variants={itemVariants}>Our Tenets</motion.h2>
        <motion.ul className="w-full flex flex-col gap-3 text-left" variants={staggeredList} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {[
            'Respect for the ancient art of Bharatanatyam, honoring its history and spiritual roots',
            'Encouraging curiosity, creativity, and innovation in every student',
            'Promoting physical health through structured warm-ups, mindful stretching, and safe technique',
            'Building mental resilience, focus, and confidence through disciplined practice',
            'Fostering a sense of community, empathy, and cultural appreciation',
            'Celebrating each dancer\'s unique journey and growth',
          ].map((point, idx) => (
            <motion.li key={point} className="text-base md:text-lg text-gray-700 flex items-start gap-3" variants={staggeredItem}>
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-orange-400 mt-2 flex-shrink-0 animate-pulse" />
              <span>{point}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Meet Our Instructors */}
      <motion.div className="w-full max-w-3xl mx-auto z-10" initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVariants}>
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-pink-700 mb-8 text-center"
          variants={itemVariants}
        >
          Meet Our Instructors
        </motion.h2>
        <div className="w-full flex flex-col gap-8">
          {instructors.map((inst, i) => (
            <motion.div
              key={inst.id}
              className="bg-white/90 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 cursor-pointer hover:shadow-3xl hover:scale-105 transition-all duration-300 w-full relative"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.7 }}
              whileHover={{ scale: 1.07 }}
              onClick={() => navigate(`/instructor/${inst.id}`)}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${inst.name}`}
            >
              <img src={inst.image} alt={inst.name} className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover mb-4 md:mb-0 border-4 border-pink-100 shadow-lg" />
              <div className="flex flex-col justify-center w-full">
                <div className="font-bold text-xl text-pink-700 mb-1 text-left">{inst.name}</div>
                <div className="text-pink-500 text-base mb-2 text-left">{inst.title}</div>
                <div className="text-gray-700 text-base text-left mb-2">
                  <ReactMarkdown>{inst.shortBio}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About; 