import { GOOGLE_PLACES_CONFIG } from '../config/googlePlaces';

// Utility to handle Google Places API loading
let isApiLoading = false;
let apiLoadPromise = null;

export const loadGooglePlacesApi = () => {
  // If API is already loaded, return resolved promise
  if (window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve();
  }

  // If API is currently loading, return the existing promise
  if (isApiLoading) {
    return apiLoadPromise;
  }

  // Start loading the API
  isApiLoading = true;
  apiLoadPromise = new Promise((resolve, reject) => {
    // Check if script is already in the document
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    
    if (existingScript) {
      // If script exists but API isn't loaded yet, wait for it
      const checkApiLoaded = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(checkApiLoaded);
          isApiLoading = false;
          resolve();
        }
      }, 100);

      // Set a timeout to prevent infinite checking
      setTimeout(() => {
        clearInterval(checkApiLoaded);
        isApiLoading = false;
        reject(new Error('Timeout waiting for Google Places API to load'));
      }, 10000); // 10 second timeout
    } else {
      // Create and append the script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_CONFIG.API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        isApiLoading = false;
        resolve();
      };
      
      script.onerror = () => {
        isApiLoading = false;
        reject(new Error('Failed to load Google Places API script'));
      };

      document.head.appendChild(script);
    }
  });

  return apiLoadPromise;
}; 