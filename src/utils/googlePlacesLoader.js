// Utility to handle Google Places API loading
let isApiLoading = false;
let apiLoadPromise = null;

export const loadGooglePlacesApi = async () => {
  try {
    // Load both configs
    const [staticConfig, envConfig] = await Promise.all([
      import('../config/googlePlaces.json').then(module => module.default),
      import('../config/googlePlaces.env.json').then(module => module.default)
        .catch(() => ({ apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY }))
    ]);

    // Merge configs
    const config = {
      ...staticConfig,
      apiKey: envConfig.apiKey || import.meta.env.VITE_GOOGLE_PLACES_API_KEY
    };

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
      // Check if script is already in the document
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      
      if (existingScript) {
        // If script exists but API isn't loaded yet, wait for it
        const checkApiLoaded = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            clearInterval(checkApiLoaded);
            isApiLoading = false;
            resolve(config);
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
        script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          isApiLoading = false;
          resolve(config);
        };
        
        script.onerror = () => {
          isApiLoading = false;
          reject(new Error('Failed to load Google Places API script'));
        };

        document.head.appendChild(script);
      }
    });

    return apiLoadPromise;
  } catch (error) {
    console.error('Error loading Google Places API:', error);
    throw error;
  }
}; 