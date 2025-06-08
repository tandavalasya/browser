import googlePlacesConfig from '../config/googlePlaces.json';

// Utility to handle Google Places API loading
let apiLoadPromise = null;

export const loadGooglePlacesApi = async () => {
  // If already loaded, return immediately
  if (window.google?.maps?.places) {
    return window.google.maps.places;
  }

  // If currently loading, return the existing promise
  if (apiLoadPromise) {
    return apiLoadPromise;
  }

  // Create new loading promise
  apiLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googlePlacesConfig.apiKey}&libraries=maps,places&callback=initGooglePlacesApi&loading=async`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      apiLoadPromise = null;
      reject(new Error('Failed to load Google Places API'));
    };

    window.initGooglePlacesApi = () => {
      resolve(window.google.maps.places);
    };

    document.head.appendChild(script);
  });

  return apiLoadPromise;
};

// Reset function for testing purposes
export const resetGooglePlacesApi = () => {
  apiLoadPromise = null;
}; 