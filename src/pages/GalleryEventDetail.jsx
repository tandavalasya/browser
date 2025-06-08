import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import galleryEvents from '../posts/galleryEvents';

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

const GalleryEventDetail = () => {
  const { slug } = useParams();
  const event = galleryEvents.find(e => e.slug === slug);
  if (!event) return <div className="max-w-2xl mx-auto py-12">Event not found.</div>;

  // Remove the first-level heading from event.content if present
  let content = event.content;
  if (content.startsWith('# ')) {
    content = content.replace(/^# .+?\n+/, '');
  }
  return (
    <motion.section
      className="max-w-2xl mx-auto py-12 px-2 sm:px-4"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Link to="/gallery" className="text-pink-600 hover:underline mb-4 inline-block">← Back to Gallery</Link>
      </motion.div>
      <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
        <img src={event.image} alt={event.title} className="w-full h-64 object-cover rounded-xl mb-6 shadow transition-transform duration-300" />
      </motion.div>
      <motion.h1 className="text-3xl font-bold mb-2 text-pink-700 text-left" variants={itemVariants}>{event.title}</motion.h1>
      <motion.p className="text-sm text-gray-400 mb-4 text-left" variants={itemVariants}>{event.date}</motion.p>
      <motion.div className="prose prose-pink max-w-none text-lg text-left" variants={itemVariants}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </motion.div>
    </motion.section>
  );
};

export default GalleryEventDetail; 