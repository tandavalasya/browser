import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import samplePosts from '../posts/samplePosts';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setPosts(samplePosts);
    }, 300);
  }, []);

  return (
    <section className="max-w-4xl mx-auto py-12 px-2 sm:px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-pink-700">Blog</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group bg-white rounded-xl shadow-md p-0 hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden cursor-pointer"
          >
            <img src={post.image} alt={post.title} className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-2xl font-bold mb-2 text-pink-600 group-hover:text-pink-700 transition-colors">{post.title}</h3>
              <p className="text-sm text-gray-400 mb-2">{post.date}</p>
              <p className="text-gray-700 mb-4 flex-1">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Blog; 