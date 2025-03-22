import React, { useState, useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];
const googleMapsApiKey = "copy from mail ok";

function PersonalizedRecommendation() {
  // Properly load the Google Maps API with the places library
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey,
    libraries,
  });

  const [location, setLocation] = useState({ lat: 19.295169, lng: 72.853415 });
  const [locationName, setLocationName] = useState("");
  const [radius, setRadius] = useState(5000);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topRecommendedId, setTopRecommendedId] = useState(null);
  
  // Location selection refs
  const autocompleteRef = useRef(null);
  const locationInputRef = useRef(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    openNow: false,
    minRating: 0,
    sortBy: "distance", // options: distance, rating, reviews
  });

  // Get current location name when component mounts
  useEffect(() => {
    if (isLoaded && location.lat && location.lng) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: location }, (results, status) => {
        if (status === "OK" && results[0]) {
          setLocationName(results[0].formatted_address);
        } else {
          setLocationName("Unknown location");
        }
      });
    }
  }, [isLoaded, location]);

  // Setup Google Places Autocomplete
  useEffect(() => {
    if (isLoaded && locationInputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        locationInputRef.current,
        { types: ["geocode"] }
      );
      
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        
        if (place.geometry && place.geometry.location) {
          setLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
          setLocationName(place.formatted_address || place.name);
        }
      });
    }
  }, [isLoaded]);

  // Apply filters whenever places or filters change
  useEffect(() => {
    if (places.length > 0) {
      applyFilters();
    }
  }, [places, filters]);

  // Determine the most recommended place
  useEffect(() => {
    if (places.length > 0) {
      findTopRecommendedPlace();
    }
  }, [places]);

  const searchNearby = () => {
    if (!location.lat || !location.lng || !isLoaded) return;
    setLoading(true);

    try {
      const map = document.createElement("div"); // Dummy element for PlacesService
      const service = new window.google.maps.places.PlacesService(map);
      const request = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius,
        type: "doctor",
        keyword: "psychiatrist",
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Calculate distance from current location for each place
          const resultsWithDistance = results.map(place => {
            const placeLocation = place.geometry.location;
            const distance = calculateDistance(
              location.lat, 
              location.lng, 
              placeLocation.lat(), 
              placeLocation.lng()
            );
            return { ...place, distance };
          });
          
          setPlaces(resultsWithDistance);
          // Initial filtering will happen via the useEffect
        } else {
          console.error("Place search failed:", status);
          setPlaces([]);
          setFilteredPlaces([]);
          setTopRecommendedId(null);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Error in searchNearby:", error);
      setLoading(false);
    }
  };

  // Haversine formula to calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  // Calculate recommendation score based on specific criteria
  const calculateRecommendationScore = (place) => {
    // If the place isn't open, it gets a score of -1 (will never be recommended)
    if (!place.opening_hours?.open_now) {
      return -1;
    }
    
    // If rating is less than 4.5, it gets a lower base score
    if (!place.rating || place.rating < 4.5) {
      return -0.5;
    }
    
    // Normalize distances (closer is better) - this has highest weight
    const maxDistance = Math.max(...places.map(p => p.distance || 0));
    const normalizedDistance = maxDistance > 0 ? 1 - (place.distance / maxDistance) : 0;
    
    // Normalize ratings (higher is better)
    const normalizedRating = (place.rating || 0) / 5;
    
    // Normalize review counts (more is better)
    const maxReviews = Math.max(...places.map(p => p.user_ratings_total || 0));
    const normalizedReviews = maxReviews > 0 ? (place.user_ratings_total || 0) / maxReviews : 0;
    
    // Calculate combined score with weights
    // Distance: 50%, Rating: 30%, Reviews: 20%
    return (normalizedDistance * 0.5) + (normalizedRating * 0.3) + (normalizedReviews * 0.2);
  };

  // Find the top recommended place based on score
  const findTopRecommendedPlace = () => {
    if (places.length === 0) {
      setTopRecommendedId(null);
      return;
    }

    // Find places that meet the minimum criteria
    const candidatePlaces = places.filter(place => 
      place.opening_hours?.open_now === true && 
      (place.rating || 0) >= 4.5
    );

    if (candidatePlaces.length === 0) {
      // If no places meet the core criteria, fall back to just open places
      const openPlaces = places.filter(place => place.opening_hours?.open_now === true);
      
      if (openPlaces.length === 0) {
        setTopRecommendedId(null); // No open places found
        return;
      }
      
      // From open places, find the best by distance and rating
      let bestPlace = openPlaces[0];
      let bestScore = -Infinity;
      
      openPlaces.forEach(place => {
        // Simplified score for fallback
        const score = ((place.rating || 0) * 0.3) - (place.distance * 0.7);
        if (score > bestScore) {
          bestScore = score;
          bestPlace = place;
        }
      });
      
      setTopRecommendedId(bestPlace.place_id);
      return;
    }

    // Calculate scores for all candidate places
    let topPlace = candidatePlaces[0];
    let topScore = calculateRecommendationScore(candidatePlaces[0]);

    candidatePlaces.forEach(place => {
      const score = calculateRecommendationScore(place);
      if (score > topScore) {
        topScore = score;
        topPlace = place;
      }
    });

    setTopRecommendedId(topPlace.place_id);
  };

  const applyFilters = () => {
    let filtered = [...places];
  
    // Filter by open now if checked
    if (filters.openNow) {
      filtered = filtered.filter((place) => place.opening_hours?.open_now === true);
    }
  
    // Filter by minimum rating
    if (filters.minRating > 0) {
      filtered = filtered.filter((place) => place.rating && place.rating >= filters.minRating);
    }
  
    // Sort the results based on the selected criteria
    switch (filters.sortBy) {
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "reviews":
        filtered.sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
        break;
      case "distance":
      default:
        filtered.sort((a, b) => a.distance - b.distance);
    }
    
    // Move the recommended place to the top if it exists in the filtered results
    if (topRecommendedId) {
      const topRecommendedIndex = filtered.findIndex(place => place.place_id === topRecommendedId);
      if (topRecommendedIndex > -1) {
        const [recommended] = filtered.splice(topRecommendedIndex, 1);
        filtered.unshift(recommended);
      }
    }
  
    setFilteredPlaces(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Function to determine if we can show results
  const canShowResults = () => {
    return places.length > 0;
  };

  // Reset to current location
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(currentLocation);
          
          // Clear the input field
          if (locationInputRef.current) {
            locationInputRef.current.value = "";
          }
          
          // Update location name
          if (isLoaded) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: currentLocation }, (results, status) => {
              if (status === "OK" && results[0]) {
                setLocationName(results[0].formatted_address);
              } else {
                setLocationName("Unknown location");
              }
            });
          }
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  };

  // Function to open Google search for a place in a new tab
  const openGoogleSearch = (placeName) => {
    const searchQuery = encodeURIComponent(placeName);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
  };

  // Handle API loading errors
  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-md">
          <h1 className="text-2xl font-bold">Mental Health Support Finder</h1>
          <p className="text-sm mt-1 opacity-90">Find professional help nearby</p>
        </header>
        <main className="flex-grow p-4">
          <div className="p-4 bg-red-100 text-red-800 rounded-lg mb-4 shadow-sm">
            Error loading Google Maps API. Please check your API key and try again.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-md">
        <h1 className="text-2xl font-bold">Mental Health Support Finder</h1>
        <p className="text-sm mt-1 opacity-90">Find professional help nearby</p>
      </header>

      <main className="flex-grow p-4 md:p-6">
        {!isLoaded ? (
          <div className="p-4 bg-blue-100 text-blue-800 rounded-lg mb-4 shadow-sm">
            Loading resources...
          </div>
        ) : (
          <>
            {/* Inspirational Quote */}
            <div className="mb-6 p-5 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg shadow-sm text-center">
              <p className="text-gray-700 italic">"Mental health is not a destination, but a process. It's about how you drive, not where you're going."</p>
              <p className="text-gray-500 text-sm mt-1">— Noam Shpancer</p>
            </div>
            
            {/* Location Section */}
            <div className="mb-6 p-5 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-3 text-blue-700">Your Location</h2>
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-grow">
                  <label htmlFor="location-input" className="sr-only">Search location</label>
                  <input
                    ref={locationInputRef}
                    id="location-input"
                    type="text"
                    placeholder="Search for a location"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <button
                  onClick={useCurrentLocation}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow-sm"
                >
                  Use My Location
                </button>
              </div>
              
              {/* Current location display */}
              {locationName && (
                <div className="p-3 bg-blue-50 rounded-lg mt-2 text-center">
                  <p className="text-blue-700">
                    <span className="font-medium">Current location:</span> {locationName}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-5 rounded-lg shadow-sm">
              <div className="w-full sm:w-1/3">
                <label className="text-gray-700 block mb-2">Search Radius (meters):</label>
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <button
    onClick={searchNearby}
    disabled={!location.lat || !location.lng || loading}
    className={`px-6 py-3 text-white rounded-lg transition duration-200 shadow-sm ${
      !location.lat || !location.lng || loading 
      ? 'bg-gray-400 cursor-not-allowed' 
      : 'bg-green-500 hover:bg-green-600'
    }`}
  >
    {loading ? "Searching..." : "Find Support"}
  </button>
            </div>
            
            {!location.lat && !location.lng && (
              <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg mb-6 shadow-sm">
                Waiting for your location... Please allow location access if prompted.
              </div>
            )}

            {loading && (
              <div className="p-4 bg-blue-100 text-blue-800 rounded-lg mb-6 shadow-sm flex items-center justify-center space-x-3">
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Finding mental health professionals near you...</span>
              </div>
            )}

            {canShowResults() && (
              <div className="mb-6 p-5 bg-white rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-3 text-blue-700">Filter Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <input
                      type="checkbox"
                      id="openNow"
                      name="openNow"
                      checked={filters.openNow}
                      onChange={handleFilterChange}
                      className="mr-2 h-5 w-5 text-blue-600"
                    />
                    <label htmlFor="openNow" className="text-gray-700">Currently Available</label>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label htmlFor="minRating" className="block mb-1 text-gray-700">Minimum Rating:</label>
                    <select
                      id="minRating"
                      name="minRating"
                      value={filters.minRating}
                      onChange={handleFilterChange}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value="0">Any Rating</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label htmlFor="sortBy" className="block mb-1 text-gray-700">Sort By:</label>
                    <select
                      id="sortBy"
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={handleFilterChange}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value="distance">Distance</option>
                      <option value="rating">Highest Rating</option>
                      <option value="reviews">Most Reviews</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {canShowResults() && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4 text-blue-700">
                  Available Support ({filteredPlaces.length} of {places.length})
                </h2>
                {filteredPlaces.length === 0 ? (
                  <p className="p-4 bg-gray-50 rounded-lg text-gray-600 text-center">No results match your filters.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPlaces.map((place) => (
                      <div 
                        key={place.place_id} 
                        className={`rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 
                                   ${place.place_id === topRecommendedId 
                                     ? 'border-2 border-green-400 bg-green-50' 
                                     : 'border border-gray-200 bg-white'}`}
                      >
                        <div className="p-5">
                          <div className="flex items-start">
                            {place.place_id === topRecommendedId && (
                              <div className="relative group mr-2">
                                <span className="text-xl cursor-help">🌟</span>
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-blue-700">{place.name}</h3>
                              <p className="text-gray-600 mt-1">{place.vicinity}</p>

                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                place.opening_hours?.open_now 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {place.opening_hours?.open_now ? "Available Now" : "Unavailable"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center">
                            {place.rating ? (
                              <div className="flex items-center text-yellow-500">
                                <span className="mr-1">{place.rating}</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                <span className="ml-2 text-gray-600">({place.user_ratings_total || 0} reviews)</span>
                              </div>
                            ) : (
                              <span className="text-gray-500">No ratings yet</span>
                            )}
                            <span className="ml-auto text-gray-600">
                              {place.distance.toFixed(2)} km away
                            </span>
                          </div>
                          
                          <div className="mt-4 flex items-center space-x-3">
                            <button 
                              onClick={() => openGoogleSearch(place.name)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
                            >
                              Visit
                            </button>
                            
                            {place.formatted_phone_number && (
                              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200">
                                Contact
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Show a message if search was performed but no results found */}
            {places.length === 0 && loading === false && location.lat && location.lng && (
              <div className="mt-6 p-5 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm text-center">
                <p className="text-lg text-yellow-800 mb-2">No mental health professionals found within the specified radius.</p>
                <p className="text-gray-600">Try increasing the search radius or trying a different location.</p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-700 font-medium">Need immediate support?</p>
                  <p className="mt-1">Call the Mental Health Helpline: <span className="font-bold">1-800-273-8255</span></p>
                </div>
              </div>
            )}
            
            {/* Supportive message at the bottom */}
            <div className="mt-8 mb-4 p-5 bg-purple-100 rounded-lg shadow-sm text-center">
              <p className="text-purple-800">Taking the step to seek help is a sign of strength, not weakness.</p>
              <p className="text-gray-600 mt-1">You're not alone on this journey.</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default PersonalizedRecommendation;