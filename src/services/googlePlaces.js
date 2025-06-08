// Google Places API service for fetching reviews
const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.REACT_APP_TANDAVALASYA_PLACE_ID;

const fetchGoogleReviews = async () => {
  try {
    // First, get the place details including reviews
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${GOOGLE_PLACES_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    const data = await response.json();
    
    if (!data.result || !data.result.reviews) {
      throw new Error('No reviews found');
    }

    // Transform the reviews to match our site's review format
    return data.result.reviews.map((review, index) => ({
      id: `google-${review.time}-${index}`,
      name: review.author_name,
      rating: review.rating,
      review: review.text,
      date: new Date(review.time * 1000).toISOString(), // Convert timestamp to ISO string
      source: 'google',
      // Note: Google Places API doesn't provide profile images for privacy reasons
    }));
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return []; // Return empty array on error to prevent breaking the UI
  }
};

export default fetchGoogleReviews; 