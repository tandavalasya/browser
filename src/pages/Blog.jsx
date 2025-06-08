/**
 * @fileoverview Blog page component with post listings and navigation
 * @version 2.0.0
 * @author TandavaLasya Development Team
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import samplePosts from '../posts/samplePosts';
import { Logger } from '../core/utils/logger.util';
import { ErrorHandler } from '../core/utils/error-handler.util';
import { AnimationWrapper, StaggerContainer } from '../components/ui/Animation/AnimationWrapper';
import { ErrorBoundary } from '../components/ui/ErrorBoundary/ErrorBoundary';

// Initialize services
const logger = new Logger('Blog');
const errorHandler = new ErrorHandler();

/**
 * Class for managing blog post data operations (Single Responsibility)
 */
class BlogPostManager {
  constructor() {
    this.posts = [];
    this.loading = false;
    this.error = null;
  }

  /**
   * Load blog posts with simulated delay
   * @returns {Promise<Array>} Array of blog posts
   */
  async loadPosts() {
    try {
      logger.debug('Loading blog posts');
      this.loading = true;
      this.error = null;

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      this.posts = samplePosts;
      this.loading = false;
      
      logger.info('Blog posts loaded successfully', { 
        count: this.posts.length,
        titles: this.posts.map(p => p.title)
      });
      
      return this.posts;
    } catch (error) {
      this.loading = false;
      this.error = error;
      logger.error('Failed to load blog posts', { error: error.message });
      throw error;
    }
  }

  /**
   * Validate post data structure
   * @param {Object} post - Post object to validate
   * @returns {boolean} True if valid
   */
  static validatePost(post) {
    const requiredFields = ['slug', 'title', 'date', 'excerpt', 'image'];
    return requiredFields.every(field => post && post[field]);
  }

  /**
   * Filter posts by search criteria
   * @param {Array} posts - Posts to filter
   * @param {string} searchTerm - Search term
   * @returns {Array} Filtered posts
   */
  static filterPosts(posts, searchTerm) {
    if (!searchTerm) return posts;
    
    const term = searchTerm.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(term) ||
      post.excerpt.toLowerCase().includes(term)
    );
  }
}

/**
 * Individual blog post card component
 */
const BlogPostCard = ({ post, index }) => {
  const handleCardClick = useCallback(() => {
    logger.info('Blog post card clicked', { 
      slug: post.slug, 
      title: post.title,
      index 
    });
  }, [post.slug, post.title, index]);

  if (!BlogPostManager.validatePost(post)) {
    logger.warn('Invalid post data detected', { post });
    return null;
  }

  return (
    <AnimationWrapper 
      variant="fadeInUp" 
      motionProps={{ 
        transition: { delay: index * 0.1 },
        whileHover: { 
          scale: 1.03, 
          boxShadow: '0 8px 32px 0 rgba(255, 99, 132, 0.15)' 
        },
        whileTap: { scale: 0.97 }
      }}
    >
      <div className="group bg-white rounded-xl shadow-md p-0 hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden cursor-pointer">
        <Link 
          to={`/blog/${post.slug}`} 
          className="flex flex-col h-full"
          onClick={handleCardClick}
        >
          <div className="relative overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                logger.warn('Blog post image failed to load', { 
                  slug: post.slug, 
                  imageSrc: post.image 
                });
                e.target.src = '/images/placeholder-blog.jpg'; // Fallback image
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold mb-2 text-pink-600 group-hover:text-pink-700 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-400 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {post.date}
            </p>
            <p className="text-gray-700 mb-4 flex-1 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center text-pink-600 font-medium">
              <span>Read more</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </AnimationWrapper>
  );
};

/**
 * Blog header component
 */
const BlogHeader = () => (
  <AnimationWrapper variant="fadeIn">
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Dance{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
          Stories
        </span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Discover the beauty, tradition, and stories behind Bharatanatyam through our 
        curated collection of articles, tutorials, and cultural insights.
      </p>
    </div>
  </AnimationWrapper>
);

/**
 * Loading state component
 */
const BlogLoading = () => (
  <StaggerContainer className="max-w-4xl mx-auto py-12 px-2 sm:px-4">
    <BlogHeader />
    <AnimationWrapper variant="fadeIn">
      <div className="grid gap-8 md:grid-cols-2">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AnimationWrapper>
  </StaggerContainer>
);

/**
 * Empty state component
 */
const BlogEmpty = () => (
  <StaggerContainer className="max-w-4xl mx-auto py-12 px-2 sm:px-4">
    <BlogHeader />
    <AnimationWrapper variant="fadeIn">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Posts Yet</h3>
        <p className="text-gray-600 mb-6">
          We're working on bringing you amazing content. Check back soon!
        </p>
        <Link 
          to="/contact" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
        >
          Get Notified
        </Link>
      </div>
    </AnimationWrapper>
  </StaggerContainer>
);

/**
 * Main Blog component
 */
const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize blog post manager
  const postManager = useMemo(() => new BlogPostManager(), []);

  /**
   * Load blog posts on component mount
   */
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const loadedPosts = await postManager.loadPosts();
      setPosts(loadedPosts);
    } catch (err) {
      setError(err);
      errorHandler.handle(err, 'Blog posts loading');
    } finally {
      setLoading(false);
    }
  }, [postManager]);

  // Load posts on mount
  useEffect(() => {
    logger.info('Blog component mounted');
    loadPosts();
  }, [loadPosts]);

  // Handle loading state
  if (loading) {
    return <BlogLoading />;
  }

  // Handle error state
  if (error) {
    return (
      <StaggerContainer className="max-w-4xl mx-auto py-12 px-2 sm:px-4">
        <BlogHeader />
        <AnimationWrapper variant="fadeIn">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-medium">Failed to load blog posts</p>
            </div>
            <button 
              onClick={loadPosts}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </AnimationWrapper>
      </StaggerContainer>
    );
  }

  // Handle empty state
  if (!posts || posts.length === 0) {
    return <BlogEmpty />;
  }

  return (
    <ErrorBoundary>
      <StaggerContainer className="max-w-4xl mx-auto py-12 px-2 sm:px-4">
        <BlogHeader />
        
        {/* Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post, index) => (
            <BlogPostCard 
              key={post.slug} 
              post={post} 
              index={index}
            />
          ))}
        </div>

        {/* Call to Action */}
        <AnimationWrapper 
          variant="fadeIn" 
          motionProps={{ transition: { delay: 0.6 } }}
        >
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Want to learn more about Bharatanatyam or join our classes?
            </p>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Today
            </Link>
          </div>
        </AnimationWrapper>
      </StaggerContainer>
    </ErrorBoundary>
  );
};

export default Blog; 