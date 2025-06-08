// Google Places API service for fetching reviews
import { getPlacesApiUrl } from '../config/googlePlaces';

const fetchGoogleReviews = async () => {
  try {
    // Get the place details including reviews using the config URL
    const response = await fetch(getPlacesApiUrl());
    
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