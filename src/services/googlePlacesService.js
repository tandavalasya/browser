// Service to handle Google Places API interactions
// Google Places configuration now comes from environment variables
import { loadGooglePlacesApi } from '../utils/googlePlacesLoader';

// Only use supported fields for the Place API
const SUPPORTED_FIELDS = ['reviews', 'rating', 'user_ratings_total'];
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export const fetchGoogleReviews = async () => {
  let map = null;
  let mapDiv = null;
  let placesService = null;

  try {
    // Validate fields before making the request
    const configFields = ['reviews', 'rating']; // From original config
    const unsupportedFields = configFields.filter(
      field => !SUPPORTED_FIELDS.includes(field)
    );
    
    if (unsupportedFields.length > 0) {
      const error = new Error(`Unsupported fields requested: ${unsupportedFields.join(', ')}`);
      console.error('Places API configuration error:', error);
      throw error;
    }

    // Create a hidden div for the map
    mapDiv = document.createElement('div');
    mapDiv.style.display = 'none';
    document.body.appendChild(mapDiv);

    // Initialize the Google Maps API and wait for it to be ready
    const placesApi = await loadGooglePlacesApi();
    if (!placesApi) {
      const error = new Error('Failed to initialize Google Places API');
      console.error('Places API initialization error:', error);
      throw error;
    }

    // Create a map instance (required for Places Service)
    map = new google.maps.Map(mapDiv, {
      center: { lat: 0, lng: 0 },
      zoom: 1
    });

    // Create Places Service instance
    placesService = new google.maps.places.PlacesService(map);

    // Create the request object with all fields we need
    const request = {
      placeId: import.meta.env.VITE_GOOGLE_PLACES_PLACE_ID,
      fields: SUPPORTED_FIELDS,
      // Get most recent reviews first
      reviews_sort: 'newest',
      // Get reviews in their original language
      reviews_no_translations: true
    };

    // Get place details
    const result = await new Promise((resolve, reject) => {
      placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place);
        } else {
          const error = new Error(`Places API error: ${status}`);
          console.error('Places API request failed:', error);
          reject(error);
        }
      });
    });

    if (!result) {
      const error = new Error('No place details found');
      console.error('Places API response error:', error);
      throw error;
    }

    // Log the raw response for debugging
    console.log('Places API response:', {
      status: 'OK',
      place: {
        rating: result.rating,
        user_ratings_total: result.user_ratings_total,
        reviews_count: result.reviews?.length || 0,
        has_reviews: !!result.reviews,
        review_fields: result.reviews?.[0] ? Object.keys(result.reviews[0]) : [],
        // Log the first review's timestamp to verify sorting
        first_review_time: result.reviews?.[0]?.time ? new Date(result.reviews[0].time * 1000).toISOString() : null,
        last_review_time: result.reviews?.[result.reviews?.length - 1]?.time ? 
          new Date(result.reviews[result.reviews.length - 1].time * 1000).toISOString() : null
      }
    });

    // Transform reviews to match our format
    const transformedReviews = {
      reviews: (result.reviews || []).map((review, index) => ({
        id: `google-${review.time || Date.now()}-${index}-${review.author_name?.replace(/\s+/g, '') || 'user'}`,
        source: 'google',
        author: review.author_name || 'Google User',
        rating: review.rating || 5,
        text: review.text || '',
        date: review.time ? new Date(review.time * 1000).toISOString() : new Date().toISOString(),
        profilePhoto: review.profile_photo_url || null
      })),
      rating: result.rating || 0,
      totalReviews: result.user_ratings_total || (result.reviews?.length || 0)
    };

    console.log('Transformed reviews:', {
      totalReviews: transformedReviews.totalReviews,
      averageRating: transformedReviews.rating,
      reviewsAvailable: result.reviews?.length || 0,
      totalRatings: result.user_ratings_total,
      firstReviewDate: transformedReviews.reviews[0]?.date,
      lastReviewDate: transformedReviews.reviews[transformedReviews.reviews.length - 1]?.date
    });

    return transformedReviews;

  } catch (error) {
    console.error('Error in fetchGoogleReviews:', error);
    throw error;
  } finally {
    // Clean up resources
    if (mapDiv && mapDiv.parentNode) {
      mapDiv.parentNode.removeChild(mapDiv);
    }
    map = null;
    mapDiv = null;
    placesService = null;
  }
}; 