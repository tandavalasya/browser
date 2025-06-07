import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import samplePosts from '../posts/samplePosts';

const BlogPost = () => {
  const { slug } = useParams();
  const post = samplePosts.find(p => p.slug === slug);
  if (!post) {
    return <div className="max-w-2xl mx-auto py-12 px-4 text-center text-red-600">Post not found.</div>;
  }
  return (
    <section className="max-w-2xl mx-auto py-12 px-4">
      <Link to="/blog" className="text-pink-600 hover:underline mb-4 inline-block">← Back to Blog</Link>
      <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-6" />
      <h1 className="text-4xl font-bold mb-2 text-pink-700">{post.title}</h1>
      <p className="text-gray-400 mb-6">{post.date}</p>
      <article className="prose prose-pink max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </section>
  );
};

export default BlogPost; 