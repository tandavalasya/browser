import React from 'react';
import { motion } from 'framer-motion';

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.15, duration: 0.7 },
  }),
};

const About = () => (
  <section className="relative min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-white py-8 px-4 flex flex-col items-center">
    {/* Hero Section */}
    <motion.div
      className="w-full max-w-4xl flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 mb-12 md:mb-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={heroVariants}
    >
      <div className="flex-shrink-0 flex items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-white/70 rounded-full shadow-lg ring-2 ring-pink-200 overflow-hidden">
        <img src="/logo.png" alt="TandavaLasya Logo" className="w-28 h-28 md:w-36 md:h-36 object-contain" />
      </div>
      <div className="flex-1 text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-pink-700 leading-tight mb-2">
          Bhargavi Venkataraman
        </h1>
        <div className="h-1 w-20 bg-gradient-to-r from-pink-400 to-orange-300 rounded-full mb-3 animate-pulse" />
        <p className="text-lg md:text-xl text-gray-700 font-medium mb-1">
          MFA (Bharatanatyam), Grade B Doordarshan Artist
        </p>
        <p className="text-gray-600 text-base md:text-lg">
          Award-winning performer, teacher, and nattuvanar. Dedicated to blending tradition and innovation in Bharatanatyam, Bhargavi inspires students of all ages with her artistry and teaching.
        </p>
      </div>
    </motion.div>

    {/* Info Cards */}
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Biography */}
      <motion.div
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-7 flex flex-col"
        custom={0}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h2 className="text-xl font-bold text-pink-600 mb-3">Biography</h2>
        <p className="text-gray-700 mb-2">Bhargavi Venkataraman, an engineer by profession, began her nrithya journey as a third grader. She holds her Masters of Fine Arts in Bharatanatyam from SASTRA University, India, and is a Grade B Doordarshan artist. Bhargavi has performed at prestigious arangams, dance festivals, and sabhas across India, and was awarded Best Performer of 2016 by Sri Parthasarathy Swami Sabha. She was among the 1000 dancers at the 1000th year celebration of the Tanjore Brihadeeswarar Temple.</p>
        <p className="text-gray-700">Bhargavi is dedicated to her guru Smt. Bhagyashree Satthish, and has taught students from ages 4 to 75. She emphasizes physical fitness, constant learning, and overall well-being in her teaching. Her journey is rooted in tradition, discipline, and a passion for sharing the art of Bharatanatyam.</p>
      </motion.div>
      {/* Teaching Philosophy */}
      <motion.div
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-7 flex flex-col"
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h2 className="text-xl font-bold text-orange-600 mb-3">Teaching Philosophy</h2>
        <p className="text-gray-700">Bhargavi melds taut Bharatanatyam stances with lissome eloquence, transforming herself into various personae and navarasas. She connects with audiences and students alike through heartfelt bhava, energetic nritta, and a focus on both tradition and innovation. Her classes nurture flexibility, fitness, and creative expression.</p>
      </motion.div>
      {/* Notable Performances (spans both columns on desktop) */}
      <motion.div
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-7 flex flex-col md:col-span-2"
        custom={2}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h2 className="text-xl font-bold text-pink-700 mb-3">Notable Performances</h2>
        <ul className="border-l-4 border-pink-400 pl-6 space-y-2 text-gray-700 text-base">
          <li>Guinness World Record event (Largest Bharatanatyam dance lesson)</li>
          <li>Nitya Akhanda Nrittam (Asia Book of Records)</li>
          <li>Moovarnam – Indian Tricolor at Chennai arangams</li>
          <li>Rajarajeshwaram – 1000th year celebration, Tanjore Brihadeeswarar Temple</li>
          <li>Natyanjali festivals across Tamilnadu</li>
          <li>Indian Dance Festival, Mamallapuram</li>
          <li>Bharat Kalachar, Vipanchee, and other major sabhas</li>
          <li>Devasthanams of Tirumala Tirupathi, Chotaanikara Bhagavathi, Trivandrum Sri Anantha Padmanabha Swamy Temple</li>
          <li>In-house productions: Shiva Shakthi Thandavam, Panchavadivum, Om Namo Narayana, Panchabhoota Sthalam, Vanavil</li>
        </ul>
      </motion.div>
    </div>
  </section>
);

export default About; 