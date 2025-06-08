// Google Places API service for fetching reviews
import { GOOGLE_PLACES_CONFIG } from '../config/googlePlaces';

const fetchGoogleReviews = () => {
  return new Promise((resolve, reject) => {
    // Check if Google Places API is loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      reject(new Error('Google Places API not loaded'));
      return;
    }

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    
    const request = {
      placeId: GOOGLE_PLACES_CONFIG.PLACE_ID,
      fields: ['reviews', 'rating', 'user_ratings_total']
    };

    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.reviews) {
        // Transform the reviews to match our site's review format
        const reviews = place.reviews.map((review, index) => ({
          id: `google-${review.time}-${index}`,
          name: review.author_name,
          rating: review.rating,
          review: review.text,
          date: new Date(review.time * 1000).toISOString(), // Convert timestamp to ISO string
          source: 'google',
          // Note: Google Places API doesn't provide profile images for privacy reasons
        }));
        resolve(reviews);
      } else {
        reject(new Error('Failed to fetch reviews: ' + status));
      }
    });
  });
};

export default fetchGoogleReviews; 