// Service to handle Google Places API interactions
import { loadGooglePlacesApi } from '../utils/googlePlacesLoader';

export const fetchPlaceReviews = async (placeId) => {
  let mapDiv = null;
  let map = null;

  try {
    // Ensure API is loaded before proceeding
    await loadGooglePlacesApi();

    const { google } = window;
    if (!google || !google.maps || !google.maps.places) {
      throw new Error('Google Maps API not loaded');
    }

    // Create a temporary div for the map
    mapDiv = document.createElement('div');
    mapDiv.style.display = 'none';
    document.body.appendChild(mapDiv);

    // Create a map instance (required for the new Places API)
    map = new google.maps.Map(mapDiv, {
      center: { lat: 0, lng: 0 },
      zoom: 1,
      disableDefaultUI: true,
      gestureHandling: 'none',
      keyboardShortcuts: false
    });

    // Create a Place instance using the new API
    const place = new google.maps.places.Place({
      id: placeId,
      map: map
    });

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
  } finally {
    // Clean up the map and div
    if (mapDiv && mapDiv.parentNode) {
      mapDiv.parentNode.removeChild(mapDiv);
    }
    map = null;
    mapDiv = null;
  }
}; 