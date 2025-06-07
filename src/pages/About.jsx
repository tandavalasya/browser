import React from 'react';
import { motion } from 'framer-motion';

const About = () => (
  <section className="max-w-3xl mx-auto py-12 px-4">
    <motion.h2
      className="text-3xl font-bold mb-8 text-center text-blue-700"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      About the Teacher
    </motion.h2>
    <motion.div
      className="flex flex-col md:flex-row items-center gap-8 mb-12"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-pink-400 to-orange-400 flex items-center justify-center text-white font-extrabold text-4xl shadow-xl">TL</div>
      <div>
        <h3 className="text-2xl font-bold mb-2">Smt. [Your Name]</h3>
        <p className="text-gray-700 mb-2">Bharatanatyam Teacher & Performer</p>
        <p className="text-gray-600">With years of experience in learning and teaching Bharatanatyam, I am passionate about sharing the beauty and discipline of this art form with students of all ages.</p>
      </div>
    </motion.div>
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <h4 className="text-xl font-semibold mb-4 text-pink-600">My Journey</h4>
      <ul className="border-l-4 border-pink-400 pl-6 space-y-4">
        <li><span className="font-bold">Year 1:</span> Started learning Bharatanatyam</li>
        <li><span className="font-bold">Year 5:</span> First solo performance</li>
        <li><span className="font-bold">Year 10:</span> Began teaching students</li>
        <li><span className="font-bold">Year 15+:</span> Founded TandavaLasya</li>
      </ul>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <h4 className="text-xl font-semibold mb-4 text-orange-600">Testimonials</h4>
      <div className="bg-orange-100 rounded-lg p-6 text-gray-700 italic">"A wonderful teacher who inspires every student!"</div>
    </motion.div>
  </section>
);

export default About; 