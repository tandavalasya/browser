/**
 * @fileoverview Gallery page component for displaying dance events and performances
 * @version 2.0.0
 * @author TandavaLasya Development Team
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import galleryEvents from '../posts/galleryEvents';
import { Logger } from '../core/utils/logger.util';
import { AnimationWrapper, StaggerContainer } from '../components/ui/Animation/AnimationWrapper';
import { ErrorBoundary } from '../components/ui/ErrorBoundary/ErrorBoundary';

const logger = new Logger('Gallery');

const Gallery = () => {
  const [events] = useState(galleryEvents);

  useEffect(() => {
    logger.info('Gallery component mounted', { eventCount: events.length });
  }, [events.length]);

  return (
    <ErrorBoundary>
      <StaggerContainer className="max-w-5xl mx-auto py-12 px-2 sm:px-4">
        <AnimationWrapper variant="fadeIn">
          <h2 className="text-3xl font-bold mb-8 text-center text-pink-700">
            Gallery
          </h2>
        </AnimationWrapper>
        
        <div className="grid gap-8 md:grid-cols-2">
          {events.map((event, index) => (
            <AnimationWrapper 
              key={event.slug}
              variant="fadeInUp" 
              motionProps={{ 
                transition: { delay: index * 0.1 },
                whileHover: { scale: 1.03 },
                whileTap: { scale: 0.97 }
              }}
            >
              <div className="group bg-white rounded-xl shadow-md p-0 hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden cursor-pointer">
                <Link to={`/gallery/${event.slug}`} className="flex flex-col h-full">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold mb-2 text-pink-600 group-hover:text-pink-700 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">{event.date}</p>
                    <p className="text-gray-700 mb-4 flex-1">{event.excerpt}</p>
                  </div>
                </Link>
              </div>
            </AnimationWrapper>
          ))}
        </div>
      </StaggerContainer>
    </ErrorBoundary>
  );
};

export default Gallery; 