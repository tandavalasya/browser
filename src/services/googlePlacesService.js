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

    // Create a Place instance with only the fields we need
    const place = new google.maps.places.Place({
      id: placeId,
      fields: ['reviews', 'rating']  // Removed user_ratings_total as it's not supported
    });

    // Fetch the place details with the same fields
    const result = await place.fetchFields({
      fields: ['reviews', 'rating']
    });

    if (!result.reviews || !result.reviews.length) {
      return [];
    }

    // Transform the reviews to match our format
    return result.reviews.map(review => ({
      author: review.author_name,
      rating: review.rating,
      text: review.text,
      time: review.time,
      source: 'Google Business'
    }));
  } catch (error) {
    console.error('Error fetching place reviews:', error);
    throw error;
  }
}; 