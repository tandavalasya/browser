// Service to handle Google Places API interactions
import { loadGooglePlacesApi } from '../utils/googlePlacesLoader';
import googlePlacesConfig from '../config/googlePlaces.json';

// Supported fields for Places API
const SUPPORTED_FIELDS = ['reviews', 'rating', 'formatted_address'];

export async function fetchPlaceReviews() {
  let map = null;
  let mapDiv = null;

  try {
    // Validate fields before making the request
    const invalidFields = googlePlacesConfig.fields.filter(field => !SUPPORTED_FIELDS.includes(field));
    if (invalidFields.length > 0) {
      throw new Error(`Unsupported fields requested: ${invalidFields.join(', ')}`);
    }

    await loadGooglePlacesApi();
    
    // Create a hidden div for the map
    mapDiv = document.createElement('div');
    mapDiv.style.display = 'none';
    document.body.appendChild(mapDiv);

    // Create map instance
    map = new google.maps.Map(mapDiv, {
      center: { lat: 0, lng: 0 },
      zoom: 1,
      disableDefaultUI: true,
      gestureHandling: 'none',
      keyboardShortcuts: false
    });

    // Create Places Service
    const service = new google.maps.places.PlacesService(map);

    // Create request object
    const request = {
      placeId: googlePlacesConfig.placeId,
      fields: googlePlacesConfig.fields
    };

    return new Promise((resolve, reject) => {
      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          // Transform reviews to match our format
          const reviews = (place.reviews || []).map(review => ({
            author: review.author_name,
            rating: review.rating,
            text: review.text,
            time: review.time,
            source: 'Google'
          }));

          resolve({
            reviews,
            rating: place.rating,
            address: place.formatted_address
          });
        } else {
          reject(new Error(`Places service error: ${status}`));
        }
      });
    });
  } catch (error) {
    console.error('Error fetching place reviews:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error(`Error loading Google reviews: ${error.message}`);
  } finally {
    // Clean up map resources
    if (mapDiv && mapDiv.parentNode) {
      mapDiv.parentNode.removeChild(mapDiv);
    }
    map = null;
    mapDiv = null;
  }
} 