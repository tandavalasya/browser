// Utility to handle Google Places API loading
let isApiLoading = false;
let apiLoadPromise = null;

export const loadGooglePlacesApi = async () => {
  try {
    // Load the config
    const config = await import('../config/googlePlaces.json').then(module => module.default);

    // If API is already loaded, return resolved promise
    if (window.google && window.google.maps && window.google.maps.places) {
      return Promise.resolve(config);
    }

    // If API is currently loading, return the existing promise
    if (isApiLoading) {
      return apiLoadPromise;
    }

    // Start loading the API
    isApiLoading = true;
    apiLoadPromise = new Promise((resolve, reject) => {
      // Create a callback function for the API to call when loaded
      window.initGooglePlacesApi = () => {
        isApiLoading = false;
        resolve(config);
      };

      // Create and append the script with recommended loading pattern
      // Using v=beta for the new Places API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=places&callback=initGooglePlacesApi&loading=async&v=beta`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        isApiLoading = false;
        delete window.initGooglePlacesApi;
        reject(new Error('Failed to load Google Places API script'));
      };

      document.head.appendChild(script);
    });

    return apiLoadPromise;
  } catch (error) {
    console.error('Error loading Google Places API:', error);
    throw error;
  }
}; 