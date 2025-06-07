import React from 'react';
import { motion } from 'framer-motion';

const About = () => (
  <section className="max-w-3xl mx-auto py-12 px-4">
    <motion.h2
      className="text-3xl font-bold mb-8 text-center text-pink-700"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      About Bhargavi Venkataraman
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
        <h3 className="text-2xl font-bold mb-2">Bhargavi Venkataraman</h3>
        <p className="text-gray-700 mb-2">MFA (Bharatanatyam), Grade B Doordarshan Artist</p>
        <p className="text-gray-600">Award-winning performer, teacher, and nattuvanar. Dedicated to blending tradition and innovation in Bharatanatyam, Bhargavi inspires students of all ages with her artistry and teaching.</p>
      </div>
    </motion.div>
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <h4 className="text-xl font-semibold mb-4 text-pink-600">Biography</h4>
      <p className="text-gray-700 mb-4">Bhargavi Venkataraman, an engineer by profession, began her nrithya journey as a third grader. She holds her Masters of Fine Arts in Bharatanatyam from SASTRA University, India, and is a Grade B Doordarshan artist. Bhargavi has performed at prestigious arangams, dance festivals, and sabhas across India, and was awarded Best Performer of 2016 by Sri Parthasarathy Swami Sabha. She was among the 1000 dancers at the 1000th year celebration of the Tanjore Brihadeeswarar Temple.</p>
      <p className="text-gray-700 mb-4">Bhargavi is dedicated to her guru Smt. Bhagyashree Satthish, and has taught students from ages 4 to 75. She emphasizes physical fitness, constant learning, and overall well-being in her teaching. Her journey is rooted in tradition, discipline, and a passion for sharing the art of Bharatanatyam.</p>
    </motion.div>
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <h4 className="text-xl font-semibold mb-4 text-orange-600">Teaching Philosophy</h4>
      <p className="text-gray-700 mb-4">Bhargavi melds taut Bharatanatyam stances with lissome eloquence, transforming herself into various personae and navarasas. She connects with audiences and students alike through heartfelt bhava, energetic nritta, and a focus on both tradition and innovation. Her classes nurture flexibility, fitness, and creative expression.</p>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <h4 className="text-xl font-semibold mb-4 text-pink-700">Notable Performances</h4>
      <ul className="border-l-4 border-pink-400 pl-6 space-y-3 text-gray-700">
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
  </section>
);

export default About; 