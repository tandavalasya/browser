/**
 * @fileoverview Individual blog post page component
 * @version 2.0.0
 * @author TandavaLasya Development Team
 */

import React, { useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import samplePosts from '../posts/samplePosts';
import { Logger } from '../core/utils/logger.util';
import { ErrorHandler } from '../core/utils/error-handler.util';
import { AnimationWrapper, StaggerContainer } from '../components/ui/Animation/AnimationWrapper';
import { ErrorBoundary } from '../components/ui/ErrorBoundary/ErrorBoundary';

// Initialize services
const logger = new Logger('BlogPost');
const errorHandler = new ErrorHandler();

/**
 * Class for managing blog post operations (Single Responsibility)
 */
class BlogPostService {
  /**
   * Find blog post by slug
   * @param {string} slug - Post slug
   * @returns {Object|null} Blog post or null if not found
   */
  static findBySlug(slug) {
    try {
      logger.debug('Searching for blog post', { slug });
      
      if (!slug) {
        throw new Error('Post slug is required');
      }

      const post = samplePosts.find(p => p.slug === slug);
      
      if (post) {
        logger.info('Blog post found', { slug, title: post.title });
        return post;
      } else {
        logger.warn('Blog post not found', { slug });
        return null;
      }
    } catch (error) {
      logger.error('Error finding blog post', { slug, error: error.message });
      throw error;
    }
  }

  /**
   * Validate blog post structure
   * @param {Object} post - Post object to validate
   * @returns {boolean} True if valid
   */
  static validatePost(post) {
    const requiredFields = ['slug', 'title', 'date', 'content', 'image'];
    return requiredFields.every(field => post && post[field]);
  }

  /**
   * Get related posts (excluding current post)
   * @param {string} currentSlug - Current post slug
   * @param {number} limit - Number of related posts to return
   * @returns {Array} Array of related posts
   */
  static getRelatedPosts(currentSlug, limit = 3) {
    return samplePosts
      .filter(post => post.slug !== currentSlug)
      .slice(0, limit);
  }
}

/**
 * Blog post header component
 */
const BlogPostHeader = ({ post }) => (
  <div className="mb-8">
    <AnimationWrapper variant="fadeIn">
      <Link 
        to="/blog" 
        className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6 transition-colors group"
      >
        <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </Link>
    </AnimationWrapper>

    <AnimationWrapper 
      variant="fadeInUp" 
      motionProps={{ transition: { delay: 0.1 } }}
    >
      <div className="relative overflow-hidden rounded-xl mb-6 shadow-lg">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-64 md:h-80 object-cover"
          onError={(e) => {
            logger.warn('Blog post image failed to load', { 
              slug: post.slug, 
              imageSrc: post.image 
            });
            e.target.src = '/images/placeholder-blog.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
            {post.title}
          </h1>
          <div className="flex items-center text-sm opacity-90">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {post.date}
          </div>
        </div>
      </div>
    </AnimationWrapper>
  </div>
);

/**
 * Blog post content component
 */
const BlogPostContent = ({ post }) => (
  <AnimationWrapper 
    variant="fadeInUp" 
    motionProps={{ transition: { delay: 0.2 } }}
  >
    <article className="prose prose-lg prose-pink max-w-none">
      <ReactMarkdown
        components={{
          // Custom components for better styling
          h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold text-gray-900 mb-2 mt-6">{children}</h3>,
          p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-pink-500 pl-4 italic text-gray-600 my-6">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
          li: ({ children }) => <li className="text-gray-700">{children}</li>,
        }}
      >
        {post.content}
      </ReactMarkdown>
    </article>
  </AnimationWrapper>
);

/**
 * Related posts component
 */
const RelatedPosts = ({ currentSlug }) => {
  const relatedPosts = useMemo(() => 
    BlogPostService.getRelatedPosts(currentSlug, 3),
    [currentSlug]
  );

  if (relatedPosts.length === 0) return null;

  return (
    <AnimationWrapper 
      variant="fadeInUp" 
      motionProps={{ transition: { delay: 0.3 } }}
    >
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((relatedPost, index) => (
            <Link
              key={relatedPost.slug}
              to={`/blog/${relatedPost.slug}`}
              className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={relatedPost.image}
                alt={relatedPost.title}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
                  {relatedPost.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{relatedPost.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimationWrapper>
  );
};

/**
 * Post not found component
 */
const PostNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <StaggerContainer className="max-w-2xl mx-auto py-12 px-4">
      <AnimationWrapper variant="fadeIn">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Not Found</h1>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find the blog post you're looking for.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/blog')}
              className="inline-block px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
            >
              View All Posts
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
 * Main BlogPost component
 */
const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find the blog post
  const post = useMemo(() => {
    try {
      return BlogPostService.findBySlug(slug);
    } catch (error) {
      errorHandler.handle(error, 'Blog post loading');
      return null;
    }
  }, [slug]);

  // Log component mount
  useEffect(() => {
    logger.info('BlogPost component mounted', { slug, postFound: !!post });
  }, [slug, post]);

  // Handle post not found
  if (!post) {
    return <PostNotFound />;
  }

  // Validate post structure
  if (!BlogPostService.validatePost(post)) {
    logger.error('Invalid post structure', { slug, post });
    return <PostNotFound />;
  }

  return (
    <ErrorBoundary>
      <StaggerContainer className="max-w-4xl mx-auto py-12 px-4">
        <BlogPostHeader post={post} />
        <BlogPostContent post={post} />
        <RelatedPosts currentSlug={slug} />
        
        {/* Call to Action */}
        <AnimationWrapper 
          variant="fadeInUp" 
          motionProps={{ transition: { delay: 0.4 } }}
        >
          <div className="mt-12 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ready to Begin Your Bharatanatyam Journey?
            </h3>
            <p className="text-gray-600 mb-4">
              Join our classes and discover the beauty of this classical dance form.
            </p>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Contact Us
            </Link>
          </div>
        </AnimationWrapper>
      </StaggerContainer>
    </ErrorBoundary>
  );
};

export default BlogPost; 