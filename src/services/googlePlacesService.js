// Service to handle Google Places API interactions
export const fetchPlaceReviews = async (placeId) => {
  try {
    const { google } = window;
    if (!google || !google.maps || !google.maps.places) {
      throw new Error('Google Maps API not loaded');
    }

    // Create a Place instance
    const place = new google.maps.places.Place({
      id: placeId,
      fields: ['reviews', 'rating', 'user_ratings_total']
    });

    // Fetch the place details
    const result = await place.fetchFields({
      fields: ['reviews', 'rating', 'user_ratings_total']
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