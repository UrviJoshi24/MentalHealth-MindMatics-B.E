import React, { useState, useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];
const googleMapsApiKey = "AIzaSyAxp2hnf507epC1SMh22v10H5wEBHg3-AQ";

function PersonalizedRecommendation() {
  // Google Maps API loader
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey,
    libraries,
  });

  // Core state
  const [location, setLocation] = useState({ lat: 19.295169, lng: 72.853415 });
  const [locationName, setLocationName] = useState("");
  const [radius, setRadius] = useState(5000);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topRecommendedId, setTopRecommendedId] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [animateSearch, setAnimateSearch] = useState(false);
  
  // Animation states
  const [showResults, setShowResults] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);
  
  // Refs
  const autocompleteRef = useRef(null);
  const locationInputRef = useRef(null);
  const resultsRef = useRef(null);
  
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
  
  // Animation for showing results
  useEffect(() => {
    if (searchPerformed && places.length > 0) {
      // Delay to ensure DOM has updated
      setTimeout(() => {
        setShowResults(true);
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, [filteredPlaces, searchPerformed]);

  const searchNearby = () => {
    if (!location.lat || !location.lng || !isLoaded) return;
    setLoading(true);
    setSearchPerformed(true);
    setShowResults(false);
    setAnimateSearch(true);

    try {
      const map = document.createElement("div"); // Dummy element for PlacesService
      const service = new window.google.maps.places.PlacesService(map);
      const request = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius,
        type: "doctor",
        keyword: "psychiatrist OR psychologist OR therapist OR counselor OR mental health OR therapy OR counseling",
    };

      service.nearbySearch(request, (results, status) => {
        setAnimateSearch(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Calculate distance from current location for each place
          const resultsWithDistance = results.map((place, index) => {
            const placeLocation = place.geometry.location;
            const distance = calculateDistance(
              location.lat, 
              location.lng, 
              placeLocation.lat(), 
              placeLocation.lng()
            );
            return { ...place, distance, animationDelay: index * 100 };
          });
          
          setPlaces(resultsWithDistance);
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
      setAnimateSearch(false);
    }
  };

  // Haversine formula to calculate distance between coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  // Calculate recommendation score
  const calculateRecommendationScore = (place) => {
    if (!place.opening_hours?.open_now) return -1;
    if (!place.rating || place.rating < 4.5) return -0.5;
    
    const maxDistance = Math.max(...places.map(p => p.distance || 0));
    const normalizedDistance = maxDistance > 0 ? 1 - (place.distance / maxDistance) : 0;
    
    const normalizedRating = (place.rating || 0) / 5;
    
    const maxReviews = Math.max(...places.map(p => p.user_ratings_total || 0));
    const normalizedReviews = maxReviews > 0 ? (place.user_ratings_total || 0) / maxReviews : 0;
    
    return (normalizedDistance * 0.5) + (normalizedRating * 0.3) + (normalizedReviews * 0.2);
  };

  // Find the top recommended place
  const findTopRecommendedPlace = () => {
    if (places.length === 0) {
      setTopRecommendedId(null);
      return;
    }

    const candidatePlaces = places.filter(place => 
      place.opening_hours?.open_now === true && 
      (place.rating || 0) >= 4.5
    );

    if (candidatePlaces.length === 0) {
      const openPlaces = places.filter(place => place.opening_hours?.open_now === true);
      
      if (openPlaces.length === 0) {
        setTopRecommendedId(null);
        return;
      }
      
      let bestPlace = openPlaces[0];
      let bestScore = -Infinity;
      
      openPlaces.forEach(place => {
        const score = ((place.rating || 0) * 0.3) - (place.distance * 0.7);
        if (score > bestScore) {
          bestScore = score;
          bestPlace = place;
        }
      });
      
      setTopRecommendedId(bestPlace.place_id);
      return;
    }

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
  
    if (filters.openNow) {
      filtered = filtered.filter((place) => place.opening_hours?.open_now === true);
    }
  
    if (filters.minRating > 0) {
      filtered = filtered.filter((place) => place.rating && place.rating >= filters.minRating);
    }
  
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

  const toggleCardExpansion = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const canShowResults = () => {
    return places.length > 0;
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(currentLocation);
          
          if (locationInputRef.current) {
            locationInputRef.current.value = "";
          }
          
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

  const openGoogleSearch = (placeName) => {
    const searchQuery = encodeURIComponent(placeName);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
  };

  // Pulse animation for the button
  const pulseButtonClass = "animate-pulse bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1";

  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col animate-fadeIn">
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-md">
          <h1 className="text-2xl font-bold animate-slideInDown">Mental Health Support Finder</h1>
          <p className="text-sm mt-1 opacity-90">Find professional help nearby</p>
        </header>
        <main className="flex-grow p-4">
          <div className="p-4 bg-red-100 text-red-800 rounded-lg mb-4 shadow-sm animate-fadeIn">
            Error loading Google Maps API. Please check your API key and try again.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes grow {
          from { transform: scale(0.95); opacity: 0.8; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        .animate-slideInDown { animation: slideInDown 0.6s ease-out; }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out; }
        .animate-grow { animation: grow 0.5s ease-out; }
        .animate-pulse { animation: pulse 2s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-400 { animation-delay: 0.4s; }
        .animate-delay-500 { animation-delay: 0.5s; }
        .transition-all { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .pulse-star { animation: pulse 2s infinite; }
      `}</style>

      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg animate-slideInDown">
        <h1 className="text-3xl font-bold">Mental Health Support Finder</h1>
        <p className="text-sm mt-1 opacity-90">Find professional help nearby</p>
      </header>

      <main className="flex-grow p-4 md:p-6">
        {!isLoaded ? (
          <div className="p-4 bg-blue-100 text-blue-800 rounded-lg mb-4 shadow-sm animate-pulse">
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading resources...
            </div>
          </div>
        ) : (
          <>
            {/* Inspirational Quote */}
            <div className="mb-6 p-5 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg shadow-md text-center animate-slideInDown animate-delay-100 transform hover:scale-103 transition-all duration-300">
              <p className="text-gray-700 italic">"Mental health is not a destination, but a process. It's about how you drive, not where you're going."</p>
              <p className="text-gray-500 text-sm mt-1">— Noam Shpancer</p>
            </div>
            
            {/* Location Section */}
            <div className="mb-6 p-5 bg-white rounded-lg shadow-md animate-slideInUp animate-delay-200 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold mb-3 text-blue-700">Your Location</h2>
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-grow">
                  <label htmlFor="location-input" className="sr-only">Search location</label>
                  <input
                    ref={locationInputRef}
                    id="location-input"
                    type="text"
                    placeholder="Search for a location"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
                  />
                </div>
                <button
                  onClick={useCurrentLocation}
                  className={pulseButtonClass}
                >
                  Use My Location
                </button>
              </div>
              
              {/* Current location display */}
              {locationName && (
                <div className="p-3 bg-blue-50 rounded-lg mt-2 text-center animate-grow">
                  <p className="text-blue-700">
                    <span className="font-medium">Current location:</span> {locationName}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-5 rounded-lg shadow-md animate-slideInUp animate-delay-300 hover:shadow-lg transition-all duration-300">
              <div className="w-full sm:w-1/3">
                <label className="text-gray-700 block mb-2">Search Radius (meters):</label>
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
                />
              </div>
              <button
                onClick={searchNearby}
                disabled={!location.lat || !location.lng || loading}
                className={`px-6 py-3 text-white rounded-lg transform transition-all duration-300 shadow-md hover:shadow-lg ${
                  animateSearch ? 'animate-pulse' : ''
                } ${
                  !location.lat || !location.lng || loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 hover:-translate-y-1'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </div>
                ) : "Find Support"}
              </button>
            </div>
            
            {!location.lat && !location.lng && (
              <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg mb-6 shadow-sm animate-pulse">
                Waiting for your location... Please allow location access if prompted.
              </div>
            )}

            {loading && (
              <div className="p-4 bg-blue-100 text-blue-800 rounded-lg mb-6 shadow-md flex items-center justify-center space-x-3 animate-pulse">
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Finding mental health professionals near you...</span>
              </div>
            )}

            {canShowResults() && (
              <div ref={resultsRef} className={`mb-6 p-5 bg-white rounded-lg shadow-md transition-all duration-500 ${showResults ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
                <h2 className="text-xl font-bold mb-3 text-blue-700">Filter Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg transform transition-all duration-300 hover:bg-gray-100">
                    <input
                      type="checkbox"
                      id="openNow"
                      name="openNow"
                      checked={filters.openNow}
                      onChange={handleFilterChange}
                      className="mr-2 h-5 w-5 text-blue-600 transition-all duration-300"
                    />
                    <label htmlFor="openNow" className="text-gray-700">Currently Available</label>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg transform transition-all duration-300 hover:bg-gray-100">
                    <label htmlFor="minRating" className="block mb-1 text-gray-700">Minimum Rating:</label>
                    <select
                      id="minRating"
                      name="minRating"
                      value={filters.minRating}
                      onChange={handleFilterChange}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
                      >
                        <option value="0">Any rating</option>
                        <option value="3">3+ stars</option>
                        <option value="4">4+ stars</option>
                        <option value="4.5">4.5+ stars</option>
                      </select>
                    </div>
  
                    <div className="bg-gray-50 p-3 rounded-lg transform transition-all duration-300 hover:bg-gray-100">
                      <label htmlFor="sortBy" className="block mb-1 text-gray-700">Sort by:</label>
                      <select
                        id="sortBy"
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded-lg p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
                      >
                        <option value="distance">Distance</option>
                        <option value="rating">Rating</option>
                        <option value="reviews">Number of Reviews</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
  
              {searchPerformed && filteredPlaces.length === 0 && !loading && (
                <div className="p-6 bg-orange-100 text-orange-800 rounded-lg mb-6 shadow-md text-center animate-fadeIn">
                  <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                  <p>We couldn't find any mental health professionals in your selected area. Try increasing your search radius or changing your location.</p>
                </div>
              )}
  
              {canShowResults() && filteredPlaces.length > 0 && (
                <div className={`transition-all duration-500 ${showResults ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
                  <h2 className="text-2xl font-bold mb-3 text-blue-700">Available Support</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                    {filteredPlaces.map((place, index) => (
                      <div 
                        key={place.place_id}
                        className={`bg-white rounded-lg shadow-md overflow-hidden card-hover transition-all duration-500 ${
                          expandedCardId === place.place_id ? 'md:col-span-2 lg:col-span-3' : ''
                        } ${
                          place.place_id === topRecommendedId 
                            ? 'ring-2 ring-green-500 transform hover:ring-4' 
                            : ''
                        } animate-fadeIn`}
                        style={{
                          animationDelay: `${place.animationDelay || (index * 100)}ms`
                        }}
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-800 truncate">
                              {place.name}
                              {place.place_id === topRecommendedId && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 pulse-star">
                                  ★ Recommended
                                </span>
                              )}
                            </h3>
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded whitespace-nowrap">
                              {place.distance.toFixed(1)} km
                            </span>
                          </div>
                          
                          <div className="flex items-center mb-3">
                            {place.rating ? (
                              <>
                                <div className="flex items-center mr-2">
                                  <span className="text-yellow-400 font-bold">
                                    {place.rating.toFixed(1)}
                                  </span>
                                  <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                  </svg>
                                </div>
                                <span className="text-gray-500 text-sm">
                                  ({place.user_ratings_total || 0} reviews)
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-500 text-sm">No ratings yet</span>
                            )}
                          </div>
                          
                          <div className="mb-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              place.opening_hours?.open_now 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {place.opening_hours?.open_now ? 'Open now' : 'Closed'}
                            </span>
                          </div>
                          
                          {expandedCardId === place.place_id && (
                            <div className="mt-4 animate-fadeIn">
                              <p className="text-gray-600 mb-3">
                                {place.vicinity || 'Address not available'}
                              </p>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                {place.types?.map((type, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs"
                                  >
                                    {type.replace(/_/g, ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center mt-4">
                            <button
                              onClick={() => toggleCardExpansion(place.place_id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              {expandedCardId === place.place_id ? 'Show less' : 'Show more'}
                            </button>
                            
                            <button
                              onClick={() => openGoogleSearch(place.name)}
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transform transition-all duration-300 hover:scale-105"
                            >
                              More Info
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {filteredPlaces.length > 0 && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow-md animate-slideInUp">
                      <h3 className="text-lg font-bold text-blue-700 mb-2">Need more options?</h3>
                      <p className="text-gray-700 mb-3">If none of these options seem right for you, consider:</p>
                      <ul className="list-disc pl-5 mb-4 text-gray-700">
                        <li className="mb-1">Expanding your search radius</li>
                        <li className="mb-1">Checking online therapy platforms like BetterHelp or Talkspace</li>
                        <li className="mb-1">Contacting your insurance provider for in-network options</li>
                        <li className="mb-1">Using national helplines for immediate support</li>
                      </ul>
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-gray-800">
                          <strong>Crisis Resources:</strong> If you're experiencing a mental health emergency, 
                          please call the National Suicide Prevention Lifeline at <a href="tel:988" className="text-blue-600 font-bold">988</a> 
                          or text HOME to <a href="sms:741741" className="text-blue-600 font-bold">741741</a> to reach the Crisis Text Line.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
  
        <footer className="bg-gray-800 text-white p-6 animate-slideInUp">
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">About Mental Health Support Finder</h3>
            <p className="text-gray-300">This tool helps you find mental health professionals near your location. We believe everyone deserves access to quality mental health care.</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">Disclaimer</h3>
            <p className="text-gray-300">This app is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with any questions you may have.</p>
          </div>
          
          <div className="text-gray-400 text-sm text-center pt-4 border-t border-gray-700">
            &copy; {new Date().getFullYear()} Mental Health Support Finder. All rights reserved.
          </div>
        </footer>
      </div>
    );
  }
  
  export default PersonalizedRecommendation;