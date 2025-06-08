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

  return (
    <motion.section
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-orange-50 to-white py-16 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-2xl w-full flex flex-col items-center relative" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
        <img src={instructor.image} alt={instructor.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-pink-200 shadow mb-4" />
        <h1 className="text-3xl font-extrabold text-pink-700 mb-1 text-center">{instructor.name}</h1>
        <div className="text-pink-500 text-lg mb-4 text-center">{instructor.title}</div>
        <div className="prose prose-pink max-w-none text-gray-800 text-lg mb-6 text-left w-full">
          <ReactMarkdown>{instructor.detailedBio}</ReactMarkdown>
        </div>
        <button onClick={() => navigate('/about')} className="mt-2 px-6 py-2 bg-pink-100 text-pink-700 rounded-full font-semibold hover:bg-pink-200 transition">Back to Instructors</button>
      </motion.div>
    </motion.section>
  );
};

export default InstructorDetail; 