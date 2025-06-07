import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import galleryEvents from '../posts/galleryEvents';

const GalleryEventDetail = () => {
  const { slug } = useParams();
  const event = galleryEvents.find(e => e.slug === slug);
  if (!event) return <div className="max-w-2xl mx-auto py-12">Event not found.</div>;
  return (
    <section className="max-w-2xl mx-auto py-12 px-2 sm:px-4">
      <Link to="/gallery" className="text-pink-600 hover:underline mb-4 inline-block">← Back to Gallery</Link>
      <img src={event.image} alt={event.title} className="w-full h-64 object-cover rounded-xl mb-6 shadow" />
      <h1 className="text-3xl font-bold mb-2 text-pink-700">{event.title}</h1>
      <p className="text-sm text-gray-400 mb-4">{event.date}</p>
      <div className="prose prose-pink max-w-none text-lg">
        <ReactMarkdown>{event.content}</ReactMarkdown>
      </div>
    </section>
  );
};

export default GalleryEventDetail; 