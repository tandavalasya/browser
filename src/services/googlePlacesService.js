// Service to handle Google Places API interactions
import { loadGooglePlacesApi } from '../utils/googlePlacesLoader';

export const fetchPlaceReviews = async (placeId) => {
  try {
    // Ensure API is loaded before proceeding
    await loadGooglePlacesApi();

    const { google } = window;
    if (!google || !google.maps || !google.maps.places) {
      throw new Error('Google Maps API not loaded');
    }

    // Create a request object for the new Places API
    const request = {
      placeId: placeId,
      fields: ['reviews', 'rating', 'name', 'formattedAddress']
    };

    // Use the Places Service to get details
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    
    return new Promise((resolve, reject) => {
      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          if (!place.reviews || !place.reviews.length) {
            console.log('No reviews found for place:', place);
            resolve([]);
            return;
          }

          // Transform the reviews to match our format
          const reviews = place.reviews.map(review => ({
            author: review.author_name,
            rating: review.rating,
            text: review.text,
            time: review.time,
            source: 'Google Business'
          }));
          resolve(reviews);
        } else {
          console.error('Places service error:', status);
          reject(new Error(`Failed to fetch place details: ${status}`));
        }
      });
    });
  } catch (error) {
    console.error('Error fetching place reviews:', error);
    // Log more details about the error
    if (error.message) {
      console.error('Error details:', error.message);
    }
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}; 