import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import samplePosts from '../posts/samplePosts';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.13,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } },
};

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setPosts(samplePosts);
    }, 300);
  }, []);

  return (
    <section className="max-w-4xl mx-auto py-12 px-2 sm:px-4">
      <motion.h2
        className="text-3xl font-bold mb-8 text-center text-pink-700"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        Blog
      </motion.h2>
      <motion.div
        className="grid gap-8 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.slug}
              className="group bg-white rounded-xl shadow-md p-0 hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(255, 99, 132, 0.15)' }}
              whileTap={{ scale: 0.97 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
                <motion.img
                  src={post.image}
                  alt={post.title}
                  className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                />
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-2 text-pink-600 group-hover:text-pink-700 transition-colors">{post.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{post.date}</p>
                  <p className="text-gray-700 mb-4 flex-1">{post.excerpt}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Blog; 