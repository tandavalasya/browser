/**
 * Google Places Service
 * Refactored to follow SOLID principles:
 * - Single Responsibility: Only handles Google Places API operations
 * - Open/Closed: Can be extended without modifying existing code
 * - Dependency Inversion: Depends on abstractions, not concretions
 */

import { BaseService } from '../core/services/base.service.js';
import { logger } from '../core/utils/logger.util.js';
import { errorHandler, NetworkError, ApiError } from '../core/utils/error-handler.util.js';
import { APP_CONSTANTS } from '../core/constants/app.constants.js';
// Google Places configuration now comes from environment variables

/**
 * Google Places API Configuration
 */
const GOOGLE_PLACES_CONFIG = {
  SUPPORTED_FIELDS: ['reviews', 'rating', 'user_ratings_total'],
  MAX_REVIEWS: 5,
  REVIEW_SORT: 'newest',
  NO_TRANSLATIONS: true
};

/**
 * Google Places API Loader Interface
 * Follows Dependency Inversion Principle
 */
export class GooglePlacesApiLoader {
  async loadApi() {
    throw new Error('loadApi method must be implemented');
  }
}

/**
 * Default Google Places API Loader Implementation
 */
export class DefaultGooglePlacesApiLoader extends GooglePlacesApiLoader {
  constructor() {
    super();
    this.isLoaded = false;
    this.loadPromise = null;
  }

  async loadApi() {
    if (this.isLoaded) {
      return window.google?.maps?.places;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this._loadGoogleMapsScript();
    return this.loadPromise;
  }

  async _loadGoogleMapsScript() {
    return new Promise((resolve, reject) => {
      // Check if Google Maps is already loaded
      if (window.google?.maps?.places) {
        this.isLoaded = true;
        resolve(window.google.maps.places);
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          this.isLoaded = true;
          resolve(window.google?.maps?.places);
        });
        existingScript.addEventListener('error', reject);
        return;
      }

      // Load the script with API key from config
      const script = document.createElement('script');
      // Use imported config, fallback to environment variable
      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || 
        (typeof process !== 'undefined' && process.env ? process.env.REACT_APP_GOOGLE_PLACES_API_KEY : null);
      
      if (!apiKey) {
        reject(new Error('Google Places API key not configured'));
        return;
      }
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        logger.debug('Google Maps API loaded successfully');
        this.isLoaded = true;
        resolve(window.google?.maps?.places);
      };

      script.onerror = () => {
        const error = new NetworkError('Failed to load Google Maps API');
        logger.error('Failed to load Google Maps API', error);
        reject(error);
      };

      document.head.appendChild(script);
    });
  }
}

/**
 * Review Data Transformer
 * Follows Single Responsibility Principle
 */
export class ReviewDataTransformer {
  transform(googleReviewsData) {
    if (!googleReviewsData) {
      logger.warn('No Google reviews data provided');
      return this._createEmptyReviewsData();
    }

    const { reviews = [], rating = 0, user_ratings_total = 0 } = googleReviewsData;
    
    logger.debug('Transforming Google reviews data', {
      reviewCount: reviews.length,
      sampleReview: reviews[0] ? {
        hasAuthorName: !!reviews[0].author_name,
        authorName: reviews[0].author_name,
        hasText: !!reviews[0].text,
        hasRating: !!reviews[0].rating,
        hasTime: !!reviews[0].time
      } : null
    });

    const transformedReviews = reviews.map((review, index) => this._transformReview(review, index));
    
    return {
      reviews: transformedReviews,
      rating,
      totalReviews: user_ratings_total || reviews.length
    };
  }

  _transformReview(review, index) {
    // Handle Google's anonymized user names more gracefully
    const authorName = review.author_name || 'Google User';
    const displayName = this._createMeaningfulDisplayName(authorName, index);
    
    return {
      id: this._generateReviewId(review, index),
      source: APP_CONSTANTS.REVIEWS.SOURCES.GOOGLE,
      name: displayName,
      author: displayName, // Fallback for compatibility
      rating: review.rating || 5,
      review: review.text || '',
      text: review.text || '', // Fallback for compatibility  
      date: review.time ? new Date(review.time * 1000).toISOString() : new Date().toISOString(),
      image: review.profile_photo_url || null,
      profilePhoto: review.profile_photo_url || null // Fallback for compatibility
    };
  }

  _createMeaningfulDisplayName(authorName, index) {
    // If Google provides a real name, use it
    if (authorName && 
        authorName !== 'A Google User' && 
        authorName !== 'Google User' && 
        !authorName.startsWith('A Google User')) {
      return authorName;
    }
    
    // For anonymized users, create meaningful but privacy-respecting names
    const anonymousNames = [
      'Dance Enthusiast',
      'Bharatanatyam Student', 
      'Classical Dance Lover',
      'Cultural Arts Appreciator',
      'Traditional Dance Student',
      'Performance Art Student',
      'Indian Classical Dancer',
      'Dance Academy Student'
    ];
    
    return anonymousNames[index % anonymousNames.length];
  }

  _generateReviewId(review, index) {
    const timestamp = review.time || Date.now();
    const authorSlug = review.author_name?.replace(/\s+/g, '') || 'user';
    return `google-${timestamp}-${index}-${authorSlug}`;
  }

  _createEmptyReviewsData() {
    return {
      reviews: [],
      rating: 0,
      totalReviews: 0
    };
  }
}

/**
 * Google Places Service
 * Main service class that orchestrates the Google Places operations
 */
export class GooglePlacesService extends BaseService {
  constructor(
    apiLoader = new DefaultGooglePlacesApiLoader(),
    dataTransformer = new ReviewDataTransformer(),
    config = null
  ) {
    super();
    this.apiLoader = apiLoader;
    this.dataTransformer = dataTransformer;
    this.config = config || this._loadConfig();
    this.placesService = null;
    this.map = null;
    this.mapDiv = null;
  }

  /**
   * Fetch Google reviews for the configured place
   * @returns {Promise<Object>} - Transformed reviews data
   */
  async fetchReviews() {
    const context = 'GooglePlacesService.fetchReviews';
    logger.info('Fetching Google reviews', {
      configLoaded: !!this.config,
      placeId: this.config?.placeId,
      apiKey: this.config?.apiKey ? 'CONFIGURED' : 'MISSING'
    });

    try {
      // Validate configuration
      this._validateConfiguration();

      // Initialize Google Places API
      await this._initializeGooglePlaces();

      // Get place details
      const placeData = await this._getPlaceDetails();

      // Transform and return data
      const transformedData = this.dataTransformer.transform(placeData);

      logger.info('Google reviews fetched successfully', {
        reviewCount: transformedData.reviews.length,
        averageRating: transformedData.rating,
        totalReviews: transformedData.totalReviews
      });

      return transformedData;

    } catch (error) {
      logger.error('Google Places service error', {
        message: error.message,
        stack: error.stack,
        config: this.config
      });
      const handledError = errorHandler.handle(error, context);
      throw new ApiError(handledError.message, null, error);
    } finally {
      this._cleanup();
    }
  }

  /**
   * Validate service configuration
   * @private
   */
  _validateConfiguration() {
    if (!this.config?.placeId) {
      throw new Error('Google Places configuration missing: placeId is required');
    }

    if (!this.config?.fields) {
      throw new Error('Google Places configuration missing: fields are required');
    }

    const unsupportedFields = this.config.fields.filter(
      field => !GOOGLE_PLACES_CONFIG.SUPPORTED_FIELDS.includes(field)
    );

    if (unsupportedFields.length > 0) {
      throw new Error(`Unsupported fields: ${unsupportedFields.join(', ')}`);
    }
  }

  /**
   * Initialize Google Places API
   * @private
   */
  async _initializeGooglePlaces() {
    logger.debug('Initializing Google Places API');

    // Load Google Places API
    const placesApi = await this.apiLoader.loadApi();
    if (!placesApi) {
      throw new NetworkError('Failed to initialize Google Places API');
    }

    // Create hidden map container
    this._createMapContainer();

    // Initialize map and places service
    this.map = new google.maps.Map(this.mapDiv, {
      center: { lat: 0, lng: 0 },
      zoom: 1
    });

    this.placesService = new google.maps.places.PlacesService(this.map);

    logger.debug('Google Places API initialized successfully');
  }

  /**
   * Get place details from Google Places API
   * @private
   */
  async _getPlaceDetails() {
    const request = {
      placeId: this.config.placeId,
      fields: GOOGLE_PLACES_CONFIG.SUPPORTED_FIELDS,
      reviews_sort: GOOGLE_PLACES_CONFIG.REVIEW_SORT,
      reviews_no_translations: GOOGLE_PLACES_CONFIG.NO_TRANSLATIONS
    };

    logger.debug('Requesting place details', { placeId: this.config.placeId });

    return new Promise((resolve, reject) => {
      this.placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          logger.debug('Place details received', {
            rating: place.rating,
            reviewCount: place.reviews?.length || 0,
            totalRatings: place.user_ratings_total
          });
          resolve(place);
        } else {
          const error = new ApiError(`Google Places API error: ${status}`);
          logger.error('Failed to get place details', { status, error });
          reject(error);
        }
      });
    });
  }

  /**
   * Create hidden map container
   * @private
   */
  _createMapContainer() {
    this.mapDiv = document.createElement('div');
    this.mapDiv.style.display = 'none';
    document.body.appendChild(this.mapDiv);
  }

  /**
   * Load configuration from imported config or environment defaults
   * @private
   */
  _loadConfig() {
    // Load configuration from environment variables
    return {
      placeId: import.meta.env.VITE_GOOGLE_PLACES_PLACE_ID,
      apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
      fields: GOOGLE_PLACES_CONFIG.SUPPORTED_FIELDS
    };
  }

  /**
   * Cleanup resources
   * @private
   */
  _cleanup() {
    if (this.mapDiv && this.mapDiv.parentNode) {
      this.mapDiv.parentNode.removeChild(this.mapDiv);
    }
    this.map = null;
    this.mapDiv = null;
    this.placesService = null;
  }
}

// Export singleton instance for convenience
export const googlePlacesService = new GooglePlacesService();

// Export legacy function for backward compatibility
export const fetchGoogleReviews = () => googlePlacesService.fetchReviews(); 