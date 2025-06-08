import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const InstructorDetail = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    import('../config/instructors.json').then((mod) => {
      const data = mod.default || mod;
      const found = data.find((inst) => inst.id === id);
      if (!found) navigate('/about');
      setInstructor(found);
    });
  }, [id, navigate]);

  if (!instructor) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  // Notable Highlights markdown (only for Bhargavi)
  const notableHighlights = instructor.id === 'bhargavi' ? `## Notable Highlights\n\n- Guinness World Record event (Largest Bharatanatyam dance lesson)\n- 1000th year celebration, Tanjore Brihadeeswarar Temple\n- Best Performer 2016, Sri Parthasarathy Swami Sabha\n- Major festivals & sabhas across India` : '';

  return (
    <motion.section
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-orange-50 to-white py-16 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-2xl w-full flex flex-col items-center relative" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
        <img src={instructor.image} alt={instructor.name} className="w-40 h-40 md:w-52 md:h-52 rounded-full object-cover border-4 border-pink-200 shadow mb-4" />
        <h1 className="text-3xl font-extrabold text-pink-700 mb-1 text-center">{instructor.name}</h1>
        <div className="text-pink-500 text-lg mb-4 text-center">{instructor.title}</div>
        {/* About Bhargavi section, only for Bhargavi */}
        {instructor.id === 'bhargavi' && (
          <div className="prose prose-pink max-w-none text-gray-800 text-lg mb-6 text-left w-full bg-pink-50 rounded-2xl p-6 shadow-inner">
            <h2 className="text-xl font-bold text-pink-700 mb-2">About Bhargavi</h2>
            <p>Bhargavi Venkataraman, an engineer by profession, began her nrithya journey as a third grader. She holds her Masters of Fine Arts in Bharatanatyam from SASTRA University, India, and is a Grade B Doordarshan artist. Bhargavi has performed at prestigious arangams, dance festivals, and sabhas across India, and was awarded Best Performer of 2016 by Sri Parthasarathy Swami Sabha. She was among the 1000 dancers at the 1000th year celebration of the Tanjore Brihadeeswarar Temple.</p>
            <p>Bhargavi melds taut Bharatanatyam stances with lissome eloquence, transforming herself into various personae and navarasas. She connects with audiences and students alike through heartfelt bhava, energetic nritta, and a focus on both tradition and innovation. Her classes nurture flexibility, fitness, and creative expression.</p>
            <p>{instructor.detailedBio}</p>
          </div>
        )}
        {/* Notable Performances section, only for Bhargavi */}
        {instructor.id === 'bhargavi' && (
          <div className="prose prose-pink max-w-none text-gray-800 text-lg mb-6 text-left w-full bg-orange-50 rounded-2xl p-6 shadow-inner">
            <h2 className="text-xl font-bold text-orange-700 mb-2">Notable Performances</h2>
            <ul>
              <li>Guinness World Record event (Largest Bharatanatyam dance lesson)</li>
              <li>1000th year celebration, Tanjore Brihadeeswarar Temple</li>
              <li>Best Performer 2016, Sri Parthasarathy Swami Sabha</li>
              <li>Major festivals & sabhas across India</li>
              <li>Indian Dance Festival, Mamallapuram</li>
              <li>Natyanjali festivals across Tamilnadu</li>
            </ul>
          </div>
        )}
        <button onClick={() => navigate('/about')} className="mt-2 px-6 py-2 bg-pink-100 text-pink-700 rounded-full font-semibold hover:bg-pink-200 transition">Back to Instructors</button>
      </motion.div>
    </motion.section>
  );
};

export default InstructorDetail; 