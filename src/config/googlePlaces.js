// Google Places API Configuration
export const GOOGLE_PLACES_CONFIG = {
  API_KEY: 'AIzaSyDq2U_m1Pw8asLmg9LWaOYhE4ubDNzxrr0',
  PLACE_ID: 'ChIJEVt4NMRzkFQRiQ2waSlam8o',
  // Fields we want to fetch from the API
  FIELDS: ['reviews', 'rating', 'user_ratings_total']
};

// Helper function to get the full API URL
export const getPlacesApiUrl = () => {
  const { BASE_URL, API_KEY, PLACE_ID, FIELDS } = GOOGLE_PLACES_CONFIG;
  return `${BASE_URL}/details/json?place_id=${PLACE_ID}&fields=${FIELDS}&key=${API_KEY}`;
}; 