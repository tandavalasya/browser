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

    // Use the new Places API format
    const place = new google.maps.places.Place({
      id: placeId,
      // The new API uses a different format for fields
      fields: ['reviews', 'rating', 'name', 'formattedAddress']
    });

    // Fetch place details using the new API format
    const result = await place.fetchFields();

    if (!result.reviews || !result.reviews.length) {
      console.log('No reviews found for place:', result);
      return [];
    }

    // Transform the reviews to match our format
    // The new API returns reviews in a slightly different format
    return result.reviews.map(review => ({
      author: review.authorName || review.author_name, // Handle both formats
      rating: review.rating,
      text: review.text,
      time: review.time || review.publishTime, // Handle both formats
      source: 'Google Business'
    }));
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