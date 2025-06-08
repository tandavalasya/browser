/**
 * @fileoverview Gallery event detail page component
 * @version 2.0.0
 * @author TandavaLasya Development Team
 */

import React, { useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import galleryEvents from '../posts/galleryEvents';
import { Logger } from '../core/utils/logger.util';
import { ErrorHandler } from '../core/utils/error-handler.util';
import { AnimationWrapper, StaggerContainer } from '../components/ui/Animation/AnimationWrapper';
import { ErrorBoundary } from '../components/ui/ErrorBoundary/ErrorBoundary';

// Initialize services
const logger = new Logger('GalleryEventDetail');
const errorHandler = new ErrorHandler();

/**
 * Class for managing gallery event operations (Single Responsibility)
 */
class GalleryEventService {
  /**
   * Find gallery event by slug
   * @param {string} slug - Event slug
   * @returns {Object|null} Gallery event or null if not found
   */
  static findBySlug(slug) {
    try {
      logger.debug('Searching for gallery event', { slug });
      
      if (!slug) {
        throw new Error('Event slug is required');
      }

      const event = galleryEvents.find(e => e.slug === slug);
      
      if (event) {
        logger.info('Gallery event found', { slug, title: event.title });
        return event;
      } else {
        logger.warn('Gallery event not found', { slug });
        return null;
      }
    } catch (error) {
      logger.error('Error finding gallery event', { slug, error: error.message });
      throw error;
    }
  }

  /**
   * Process event content by removing first-level heading
   * @param {string} content - Raw event content
   * @returns {string} Processed content
   */
  static processContent(content) {
    if (!content) return '';
    
    // Remove the first-level heading from event content if present
    if (content.startsWith('# ')) {
      return content.replace(/^# .+?\n+/, '');
    }
    return content;
  }

  /**
   * Validate event data structure
   * @param {Object} event - Event object to validate
   * @returns {boolean} True if valid
   */
  static validateEvent(event) {
    const requiredFields = ['slug', 'title', 'date', 'content', 'image'];
    return requiredFields.every(field => event && event[field]);
  }
}

/**
 * Event not found component
 */
const EventNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <StaggerContainer className="max-w-2xl mx-auto py-12 px-4">
      <AnimationWrapper variant="fadeIn">
        <div className="text-center">
          <div className="text-6xl mb-4">🎭</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find the gallery event you're looking for.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/gallery')}
              className="inline-block px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
            >
              View All Events
            </button>
            <p className="text-sm text-gray-500">
              or{' '}
              <button
                onClick={() => navigate(-1)}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                go back
              </button>
            </p>
          </div>
        </div>
      </AnimationWrapper>
    </StaggerContainer>
  );
};

/**
 * Event header component
 */
const EventHeader = ({ event }) => (
  <div className="mb-8">
    <AnimationWrapper variant="fadeIn">
      <Link 
        to="/gallery" 
        className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6 transition-colors group"
      >
        <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Gallery
      </Link>
    </AnimationWrapper>

    <AnimationWrapper 
      variant="fadeInUp" 
      motionProps={{ transition: { delay: 0.1 } }}
    >
      <div className="relative overflow-hidden rounded-xl mb-6 shadow-lg">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-64 md:h-80 object-cover"
          onError={(e) => {
            logger.warn('Gallery event image failed to load', { 
              slug: event.slug, 
              imageSrc: event.image 
            });
            e.target.src = '/images/placeholder-gallery.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
            {event.title}
          </h1>
          <div className="flex items-center text-sm opacity-90">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {event.date}
          </div>
        </div>
      </div>
    </AnimationWrapper>
  </div>
);

/**
 * Event content component
 */
const EventContent = ({ event }) => {
  const processedContent = useMemo(() => 
    GalleryEventService.processContent(event.content),
    [event.content]
  );

  return (
    <AnimationWrapper 
      variant="fadeInUp" 
      motionProps={{ transition: { delay: 0.2 } }}
    >
      <article className="prose prose-lg prose-pink max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold text-gray-900 mb-2 mt-6">{children}</h3>,
            p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-pink-500 pl-4 italic text-gray-600 my-6">
                {children}
              </blockquote>
            ),
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </article>
    </AnimationWrapper>
  );
};

/**
 * Main GalleryEventDetail component
 */
const GalleryEventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find the gallery event
  const event = useMemo(() => {
    try {
      return GalleryEventService.findBySlug(slug);
    } catch (error) {
      errorHandler.handle(error, 'Gallery event loading');
      return null;
    }
  }, [slug]);

  // Log component mount
  useEffect(() => {
    logger.info('GalleryEventDetail component mounted', { slug, eventFound: !!event });
  }, [slug, event]);

  // Handle event not found
  if (!event) {
    return <EventNotFound />;
  }

  // Validate event structure
  if (!GalleryEventService.validateEvent(event)) {
    logger.error('Invalid event structure', { slug, event });
    return <EventNotFound />;
  }

  return (
    <ErrorBoundary>
      <StaggerContainer className="max-w-4xl mx-auto py-12 px-4">
        <EventHeader event={event} />
        <EventContent event={event} />
        
        {/* Call to Action */}
        <AnimationWrapper 
          variant="fadeInUp" 
          motionProps={{ transition: { delay: 0.3 } }}
        >
          <div className="mt-12 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Want to Be Part of Our Next Event?
            </h3>
            <p className="text-gray-600 mb-4">
              Join our vibrant Bharatanatyam community and participate in our performances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/schedule"
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                View Schedule
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 border-2 border-pink-600 text-pink-600 font-semibold rounded-lg hover:bg-pink-600 hover:text-white transition-all duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </AnimationWrapper>
      </StaggerContainer>
    </ErrorBoundary>
  );
};

export default GalleryEventDetail; 