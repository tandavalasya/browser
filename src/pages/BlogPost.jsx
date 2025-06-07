import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import samplePosts from '../posts/samplePosts';

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

const BlogPost = () => {
  const { slug } = useParams();
  const post = samplePosts.find(p => p.slug === slug);
  if (!post) {
    return <div className="max-w-2xl mx-auto py-12 px-4 text-center text-red-600">Post not found.</div>;
  }
  return (
    <motion.section
      className="max-w-2xl mx-auto py-12 px-4"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Link to="/blog" className="text-pink-600 hover:underline mb-4 inline-block">← Back to Blog</Link>
      </motion.div>
      <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
        <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-6 transition-transform duration-300" />
      </motion.div>
      <motion.h1 className="text-4xl font-bold mb-2 text-pink-700" variants={itemVariants}>{post.title}</motion.h1>
      <motion.p className="text-gray-400 mb-6" variants={itemVariants}>{post.date}</motion.p>
      <motion.article className="prose prose-pink max-w-none" variants={itemVariants}>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </motion.article>
    </motion.section>
  );
};

export default BlogPost; 