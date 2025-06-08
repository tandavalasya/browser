// Service to handle Google Places API interactions
import googlePlacesConfig from '../config/googlePlaces.json';
import { loadGooglePlacesApi } from '../utils/googlePlacesLoader';

// Supported fields for Places API
const SUPPORTED_FIELDS = ['reviews', 'rating'];
const MAX_REVIEWS_PER_PAGE = 20;

export const fetchGoogleReviews = async () => {
  let map = null;
  let mapDiv = null;
  let placesService = null;

  try {
    // Validate fields before making the request
    const unsupportedFields = googlePlacesConfig.fields.filter(
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

    // Create the request object
    const request = {
      placeId: googlePlacesConfig.placeId,
      fields: [...googlePlacesConfig.fields, 'user_ratings_total']
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

    if (!result || !result.reviews) {
      const error = new Error('No reviews found for this place');
      console.error('Places API response error:', error);
      throw error;
    }

    // Get all reviews
    let allReviews = [...result.reviews];
    const totalReviews = result.user_ratings_total || result.reviews.length;
    
    // If there are more reviews than what we got in the first request
    if (totalReviews > result.reviews.length) {
      // Create additional requests to get more reviews
      const additionalRequests = [];
      for (let i = result.reviews.length; i < totalReviews; i += MAX_REVIEWS_PER_PAGE) {
        additionalRequests.push(
          new Promise((resolve, reject) => {
            const pageRequest = {
              placeId: googlePlacesConfig.placeId,
              fields: ['reviews'],
              pageToken: result.next_page_token
            };
            
            placesService.getDetails(pageRequest, (place, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && place && place.reviews) {
                resolve(place.reviews);
              } else {
                const error = new Error(`Failed to fetch additional reviews: ${status}`);
                console.error('Places API pagination error:', error);
                reject(error);
              }
            });
          })
        );
      }

      try {
        // Wait for all additional requests to complete
        const additionalReviews = await Promise.all(additionalRequests);
        allReviews = [...allReviews, ...additionalReviews.flat()];
      } catch (paginationError) {
        console.error('Error fetching additional reviews:', paginationError);
        // Continue with the reviews we have, but log the error
      }
    }

    // Transform reviews to match our format
    const transformedReviews = {
      reviews: allReviews.map((review, index) => ({
        id: `google-${review.time || Date.now()}-${index}-${review.author_name?.replace(/\s+/g, '') || 'user'}`,
        source: 'google',
        author: review.author_name || 'Google User',
        rating: review.rating || 5,
        text: review.text || '',
        date: review.time ? new Date(review.time * 1000).toISOString() : new Date().toISOString(),
        profilePhoto: review.profile_photo_url || null
      })),
      rating: result.rating || 0
    };

    return transformedReviews;

  } catch (error) {
    console.error('Error in fetchGoogleReviews:', error);
    throw error; // Re-throw to let the caller handle it
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