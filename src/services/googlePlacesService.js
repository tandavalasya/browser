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

    // Create a map instance (required for the new Places API)
    const map = new google.maps.Map(document.createElement('div'), {
      center: { lat: 0, lng: 0 },
      zoom: 1
    });

    // Create a Place instance using the new API
    const place = new google.maps.places.Place({
      id: placeId,
      map: map
    });

    try {
      // Fetch place details
      const result = await place.fetchFields({
        fields: ['reviews', 'rating', 'name', 'formattedAddress']
      });

      if (!result.reviews || !result.reviews.length) {
        console.log('No reviews found for place:', result);
        return [];
      }

      // Transform the reviews to match our format
      return result.reviews.map(review => ({
        author: review.authorName || review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time || review.publishTime,
        source: 'Google Business'
      }));
    } finally {
      // Clean up the map instance
      map.setMap(null);
    }
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