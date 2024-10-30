import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCheckCircle,
  faRoute,
  faWalking,
  faWheelchair,
  faCar,
  faMinus,
  faExpand,
  faMapMarkerAlt,

  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { APIProvider, Map, Marker, useMap, useMapsLibrary, InfoWindow } from "@vis.gl/react-google-maps";
import Draggable from "react-draggable";
import { getAllLocations, addToFavourites, getFavourites, getAllRentalStations } from "../../api/functions"; // Import your Firebase function
import dininghall from "../../assets/dininghalls.png";
import clubvenue from "../../assets/clubvenue.png"
import home from "../../assets/home.png";
import landmark from "../../assets/time.png";
import sports from "../../assets/sport.png";
import religion from "../../assets/church.png";
import shopping from "../../assets/shopping.png";
import community from "../../assets/community.png";
import danger from "../../assets/danger-point.png";
import rentalStationIcon from "../../assets/rental.png";
import { useAuth } from "../../contexts/AuthProvider";
import wheelchair from "../../assets/acc_entrance.png"
import axios from "axios"; // Import axios


import { useAppContext } from "../../contexts/AppContext";
function Find() {



  const [currentLocation, setCurrentLocation] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const [startpoint, setStartpoint] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);
  const grandparentRef = useRef(null);
  const [travelMode, setTravelMode] = useState("WALKING"); // Default travel mode
  const [filteredLocations1, setFilteredLocations1] = useState([]); // Store filtered locations
  const [filteredLocations2, setFilteredLocations2] = useState([]); // Store filtered locations
  const [pointsofinterest, setpointsofinterest] = useState([]);  // Store fetched locations
  const [markersVisible, setMarkersVisible] = useState(false); // State for marker visibility
  const [activeMarker, setActiveMarker] = useState(null);
  const [activeIncidents, setActiveIncidents] = useState([]); // State to hold active incidents
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [searchQuery1, setSearchQuery1] = useState(""); // Store search input
  const [searchQuery2, setSearchQuery2] = useState(""); // Store search input
  const [locations, setLocations] = useState([]);  // Store fetched locations
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [rentalMarkers, setrentalMarkers] = useState(null)
  const [showDirections, setShowDirections] = useState(false); // New state for controlling directions visibility
  const [isSaved, setIsSaved] = useState(null);
  const [favourites, setFavourites] = useState([]); // State to hold active incidents
  const [accessibleMode, setAccessibleMode] = useState(false);
  const { currentUser } = useAuth()
  const [rentalStations, setRentalStations] = useState([]);
  const { setTitle, setTask } = useAppContext();

  //const apiKey = import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY;



  const fetchPOIs = async () => {
    try {
      const allLocations = await getAllLocations();
      const POIs = allLocations.filter(location => location.category);
      setpointsofinterest(POIs);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchStations = async () => {
    try {
      const allLocations = await getAllRentalStations();
      const POIs = allLocations.filter(location => location.location);
      setRentalStations(POIs);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('https://campussafetyapp.azurewebsites.net/incidents/all-incidents');
      const activeIncidents = response.data.filter(incident => incident.active === 1);
      setActiveIncidents(activeIncidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };

  function formatDate(incidentDate) {
    const { day, month, year, time } = incidentDate;
    const formattedTime = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} at ${formattedTime}`;
  }

  // Fetch all locations (buildings and POIs) from Firebase
  const fetchLocations = async () => {
    try {
      const allLocations = await getAllLocations();
      // Filter out locations with null coordinates
      const validLocations = allLocations.filter(location => location.coordinates);
      setLocations(validLocations);
      console.log(currentLocation)
      console.log(searchQuery1)
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchFavouirites = async () => {
    try {
      const favourites = await getFavourites(currentUser.email);
      
      setFavourites(favourites)

    } catch (error) {
      console.error("Error fetching favourite locations:", error);
    }
  }

  const isFavorite = (locationName) => {
    return favourites.some(fav => fav.name === locationName);
  };




  useEffect(() => {
    setTitle("Find");
    setTask(1);
    fetchIncidents();
    fetchStations();
    fetchFavouirites();



    fetchPOIs();
    fetchLocations();



  }, [setTitle, setTask]);

  // Update filtered locations based on search query
  useEffect(() => {
    setFilteredLocations1(
      locations?.filter(location =>
        location.name.toLowerCase().includes(searchQuery1.toLowerCase())
      )
    );
  }, [searchQuery1, locations]);

  useEffect(() => {
    setFilteredLocations2(
      locations?.filter(location =>
        location?.name?.toLowerCase().includes(searchQuery2.toLowerCase())
      )
    );
  }, [searchQuery2, locations]);




  useEffect(() => {
    const building = locations.find(location => location.name === searchQuery2);

    if (accessibleMode && building) {
      adjustToAccessibleEntrance(building); // Now call this function when accessibleMode becomes true
    }
  }, [accessibleMode, searchQuery2]); // Depend on accessibleMode and destinationParam

  // Function to calculate the distance between two points using the Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const adjustToAccessibleEntrance = (building) => {
    console.log(building.accessible_entrances)
    console.log(accessibleMode)
    console.log(travelMode)
    if (accessibleMode && building?.accessible_entrances?.length > 0) {
      const currentLat = currentLocation.lat;
      const currentLng = currentLocation.lng;
      console.log(currentLocation)

      const nearestEntrance = building.accessible_entrances.reduce((closest, entrance) => {
        const entranceDistance = calculateDistance(
          currentLat, currentLng,
          entrance.latitude, entrance.longitude
        );

        console.log(entranceDistance)

        return entranceDistance < closest.distance
          ? { entrance, distance: entranceDistance }
          : closest;
      }, { entrance: null, distance: Infinity });

      if (nearestEntrance.entrance) {
        console.log("Nearest Entrance Found:", nearestEntrance);
        setDestinationPosition({
          lat: nearestEntrance.entrance.latitude,
          lng: nearestEntrance.entrance.longitude,
        });
      } else {
        setDestinationPosition(destinationPosition)

      }
    } else {
      setDestinationPosition(destinationPosition)
    }
  };


  const handleSearchChange1 = (e) => {
    setSearchQuery1(e.target.value);
    setShowDropdown1(e.target.value !== '');

  };

  const handleSearchChange2 = (e) => {
    setSearchQuery2(e.target.value);
    setShowDropdown2(e.target.value !== '');

  };


  const handleIncidentClick = (incident) => {
    setSelectedIncident(incident); // Set the selected incident
  };

  const handleStartClick = () => {
    if (!startpoint || !destinationPosition) {
      alert('Please select both a start point and destination');
      return;
    }


    setShowDirections(true);
  };

  const handleSave = async () => {
    try {
      const location = locations?.filter(location =>
        location.name.toLowerCase() === searchQuery2.toLowerCase()
      )


      if (!isFavorite(searchQuery2)) {
        console.log("saving")
        await addToFavourites(currentUser.email, JSON.stringify(location[0]));
        setIsSaved(true);
        fetchFavouirites()
      }
    } catch (error) {
      console.error('Error saving destination:', error);
    }
  };



  const handleLocationDropdownSelect = (locationName) => {
    // Find the selected location object from the list
    const selectedLocation = locationName == "My Location" ? "My Location" : locations.find(location => location.name === locationName);


    if (locationName != "My Location") {


      setSearchQuery1(selectedLocation.name); // Update the input with selected location name
      setStartpoint({lat:selectedLocation.coordinates.latitude,lng:selectedLocation.coordinates.longitude});      // Update the destination state with the object
    } else {
      setSearchQuery1("My Location"); // Update the input with selected location name
      

      setStartpoint(currentLocation);     // Set custom destination if "Other" is selected
    }
    setFilteredLocations1([]);                // Hide the dropdown after selection
    setShowDropdown1(false); // Explicitly hide the dropdown

  };

  const handleDestinationDropdownSelect = (locationName) => {
    // Find the selected location object from the list
    const selectedLocation = locations.find(location => location.name === locationName);

    setSearchQuery2(selectedLocation.name); // Update the input with selected location name
    setDestinationPosition({ lat: selectedLocation.coordinates.latitude, lng: selectedLocation.coordinates.longitude });      // Update the destination state with the object
    setFilteredLocations2([]);                // Hide the dropdown after selection
    setShowDropdown2(false); // Explicitly hide the dropdown

  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMarkerClick = (stationLocation) => {
    setShowMessage(false); // Hide the message when a rental station marker is clicked
    setDestinationPosition({ lat: stationLocation.latitude, lng: stationLocation.longitude }); // Set the destination position

  };

  const SearchInput = ({
    searchQuery,
    handleSearchChange,
    showDropdown,
    filteredLocations,
    handleSelect,
    placeholder,
    includeMyLocation = false,
    isDark = false,
    includeFavorites = false, // New prop to show favorite items

  }) => {
    const [localQuery, setLocalQuery] = useState(searchQuery); // Local state for typing
    const typingTimeout = useRef(null); // Ref to hold the debounce timeout
  
    const handleInputChange = (e) => {
      // Update the local query instantly on typing
      setLocalQuery(e.target.value);
  
      // Clear previous debounce timeout
      clearTimeout(typingTimeout.current);
  
      // Set a new debounce timeout to update global state after typing stops
      typingTimeout.current = setTimeout(() => {
        handleSearchChange(e); // Update global state
      }, 500); // Adjust debounce delay as needed
    };
  
    useEffect(() => {
      // Sync local state with global searchQuery if it changes externally
      setLocalQuery(searchQuery);
    }, [searchQuery]);
  
    useEffect(() => {
      // Cleanup debounce timeout on unmount
      return () => clearTimeout(typingTimeout.current);
    }, []);
  
    const handleFocus = () => {
      // Logic to show the correct dropdown on focus
      if (handleSelect === handleLocationDropdownSelect) {
        setShowDropdown1(true);
      } else {
        setShowDropdown2(true);
      }
    };

    const sortedLocations = includeFavorites
    ? filteredLocations.sort((a, b) => isFavorite(b.name) - isFavorite(a.name)) // Sort favorites first
    : filteredLocations;
  
    return (
      <div className="relative w-full">
        <input
          type="text"
          className={`${isDark ? 'bg-black border-white text-white' : 'bg-white border-black text-black'} 
            border p-2 rounded-md focus:outline-none focus:ring-2 
            ${isDark ? 'focus:ring-white' : 'focus:ring-black'} w-full`}
          placeholder={placeholder}
          value={localQuery} // Use local query for uninterrupted typing
          onChange={handleInputChange} // Use debounced input handler
          onFocus={handleFocus}
        />
        {showDropdown && sortedLocations.length > 0 && (
          <ul
          className={`${
            includeFavorites ? 'absolute bottom-full' : 'absolute top-full'
          } left-0 w-full bg-black border border-white rounded-md mt-1 z-10 max-h-60 overflow-y-auto`}
          style={includeFavorites ? { display: 'flex', flexDirection: 'column-reverse' } : {}}

        >
        
            {includeMyLocation && (
              <li
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect('My Location');
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-white"
              >
                My Location
              </li>
            )}
            {filteredLocations.map((location) => (
              <li
                key={location.name}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(location.name);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-white"
              >
                {location.name}

                {/* Show star for favorite items */}
              {isFavorite(location.name) && includeFavorites && (
                <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-2" />
              )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // Handle responsive dragging
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      // Disable dragging for mobile/tablet views (sm/md screens)
      if (window.innerWidth < 1024) {
        setIsDraggingEnabled(false); // Disable draggable for sm and md screens
      } else {
        setIsDraggingEnabled(true); // Enable draggable for lg and up screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial value based on window width
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Location tracking effect
  useEffect(() => {
    let watchId;

  
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error watching location:", error);
  
          // If there's an error (like timeout), set fallback location
          if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
            setCurrentLocation({ lat: -26.189706888942244, lng: 28.026747050123817 });
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,   // Max wait time
          maximumAge: 0     // Always get a fresh position
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Set fallback location if geolocation isn’t supported
      setCurrentLocation({ lat: -26.189706888942244, lng: 28.026747050123817 });
    }
  
    // Cleanup function to clear watch
    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []); // Empty dependency array means this runs once on mount
  


  return (
    <APIProvider apiKey="AIzaSyBxWXlgW0k0aTUwyanFnudRdqdNp8y413o">
      <main ref={grandparentRef} className="relative w-full h-screen">
        {/* Map Section */}
        <section className="absolute inset-0">
          {currentLocation ? (
            <div className="w-full h-full">
              <Map
                defaultZoom={17}
                defaultCenter={currentLocation}
                options={{ styles: nightModeMapStyles }}
                style={{ width: "100%", height: "100%" }}
              >
                <Marker position={currentLocation} />

                {/* Incident Markers */}
                {activeIncidents.map((incident, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: incident.latitude,
                      lng: incident.longitude,
                    }}
                    icon={{
                      url: danger,
                      scaledSize:new google.maps.Size(25, 25) , // Adjust size
                    }}
                    title={`Incident: ${incident.type}`}
                    label={
                      incident.building_name
                        ? {
                          text: incident.building_name,
                          color: "grey",
                          fontWeight: "bold",
                          fontSize: "10px",
                        }
                        : null // Null safety: if building_name is absent, don't show the label
                    }
                    onClick={() => handleIncidentClick(incident)} // Handle click to show incident description
                  />
                ))}

                {/* InfoWindow for selected incident */}
                {selectedIncident && (
                  <InfoWindow
                    position={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }}
                    onCloseClick={() => setSelectedIncident(null)} // Close InfoWindow
                  >
                    <div>
                      {selectedIncident.photo && <img src={selectedIncident.photo} alt="Incident" style={{ width: "100px", height: "100px" }} />}

                      <h3>Category: {selectedIncident.type}</h3>
                      <p>{formatDate(selectedIncident.date)}</p>
                      <p>Description: {selectedIncident.description}</p>

                    </div>
                  </InfoWindow>
                )}

                {/* Markers for accessible entrances */}
                {accessibleMode && searchQuery2 && 
                  locations.find(location => location.name === searchQuery2)?.accessible_entrances?.map((entrance, entranceIndex) => (

                    <Marker
                      key={`${entranceIndex}`} // Unique key for each entrance
                      position={{ lat: entrance.latitude, lng: entrance.longitude }}
                      icon={{
                        url: wheelchair, // Use a relevant icon for accessible entrances
                        scaledSize: new google.maps.Size(30, 30),
                      }}
                      title={`Accessible Entrance`}
                    />
                  ))
                }

                {/* Points Of interest marker */}
                {markersVisible && pointsofinterest.map((poi, index) => {

                  let iconUrl;
                  if (poi.category.toLowerCase() === "dining hall") {
                    iconUrl = dininghall;
                  } else if (poi.category.toLowerCase() === "residence") {
                    iconUrl = home;
                  } else if (poi.category.toLowerCase() === "landmark") {
                    iconUrl = landmark;
                  } else if (poi.category.toLowerCase() === "sports venue") {
                    iconUrl = sports;
                  } else if (poi.category.toLowerCase() === "religious landmark") {
                    iconUrl = religion;
                  } else if (poi.category.toLowerCase() === "shopping centre") {
                    iconUrl = shopping;
                  } else if (poi.category.toLowerCase() === "community centre") {
                    iconUrl = community;
                  } else {
                    iconUrl = clubvenue;
                  }
                  return (
                    <Marker
                      key={index}
                      position={{ lat: poi.coordinates.latitude, lng: poi.coordinates.longitude }}
                      icon={{
                        url: iconUrl,
                        scaledSize: new google.maps.Size(30, 30), // Adjust the size as needed
                      }}
                      title={poi.name}
                      label={{
                        text: poi.name,  // Display POI name next to the icon
                        color: "white",   // Adjust label color to stand out
                        fontWeight: "bold",
                        fontSize: "8px"
                      }}
                      onClick={() => setActiveMarker(poi)} // Set the active marker to this POI

                    />
                  );
                })}

                {activeMarker && (
                  <InfoWindow
                    position={{
                      lat: activeMarker.coordinates.latitude,
                      lng: activeMarker.coordinates.longitude,
                    }}
                    onCloseClick={() => setActiveMarker(null)} // Close the InfoWindow
                  >
                    <div>
                      <h3>{activeMarker.name}</h3>
                      <p>{activeMarker.category || "No description available"}</p>
                    </div>
                  </InfoWindow>
                )}



                {rentalMarkers && rentalStations.map((station, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: station.location.latitude,
                      lng: station.location.longitude,
                    }}
                    icon={{
                      url: rentalStationIcon,
                      scaledSize: new google.maps.Size(30, 30), // Adjust size
                    }}
                    title={station.name}
                    label={{
                      text: station.name,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "8px"
                    }}
                    onClick={() => handleMarkerClick(station.location)} // Handle click to set destination
                  />
                ))}

                {showDirections && (
                  <Directions
                    userPosition={startpoint}
                    destinationPosition={destinationPosition}
                    travelMode={travelMode}
                  />
                )}
              </Map>
            </div>
          ) : (
            <p>Loading map...</p>
          )}
        </section>
        <div className="fixed top-14 right-4 bg-black bg-opacity-50 text-white p-3 rounded-md flex flex-col space-y-2">
          {/* First Label and Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showPOIs"
              className="w-4 h-4"
              onChange={(e) => setMarkersVisible(e.target.checked)}

            // onChange={handleShowPOIsChange}
            />
            <label htmlFor="showPOIs" className="text-sm ml-2">
              Show Points of Interest
            </label>
          </div>

          {/* Second Label and Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showRoutes"
              className="w-4 h-4"
              onChange={(e) => setrentalMarkers(e.target.checked)}


            />
            <label htmlFor="showRoutes" className="text-sm ml-2">
              Show Rental Stations
            </label>
          </div>
        </div>


        {/* Draggable card on large screens */}
        <div className="hidden lg:flex">
          <Draggable
            bounds={grandparentRef}
            disabled={!isDraggingEnabled} // Disable draggable based on screen size
          >
             <section
  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-8 w-1/2 rounded-md shadow-lg overflow-hidden ${isDraggingEnabled ? "draggable" : ""} ${isMinimized ? "h-10" : "h-auto"}`}
>

              {/* Minimize/Maximize Button */}
          <button 
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 focus:outline-none z-10"
            onClick={toggleMinimize}
          >
            <FontAwesomeIcon 
              icon={isMinimized ? faExpand : faMinus} 
              className="text-sm"
            />
          </button>


              {/* Form Contents */}
              <div className="bg-black text-white p-10 relative flex flex-col items-start">
                {/* Location */}
                <div className="flex items-start mb-4  w-full">
                  <div className="flex flex-col items-start w-2/3">
                    <div className="flex items-center mb-0">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-white text-xl mr-2"
                      />
                      <span className="font-semibold">Location</span>
                    </div>
                  </div>

                  <SearchInput key="editor1"
                    searchQuery={searchQuery1}
                    handleSearchChange={handleSearchChange1}
                    showDropdown={showDropdown1}
                    filteredLocations={filteredLocations1}
                    handleSelect={handleLocationDropdownSelect}
                    placeholder="Select Start position"
                    includeMyLocation={true}
                    isDark={true}
                  />
                </div>

                {/* Travel Mode Options */}
                <div className="flex justify-between w-full mb-0 ml-2 mr-5">
                  <button
                    className={`rounded-md p-0 ml-3 focus:outline-none ${travelMode === "WALKING" ? "bg-black-500 text-blue-500" : "bg-black text-white"
                      }`}
                    onClick={() => {
                      setTravelMode("WALKING")
                      setAccessibleMode(true);

                    }}
                  >
                    <FontAwesomeIcon icon={faWalking} className="text-xl" />
                  </button>
                  <button
                    className={`rounded-md p-2 focus:outline-none ${travelMode === "ACCESSIBLE" ? "bg-black-500 text-blue-500" : "bg-black text-white"
                      }`}
                    onClick={() => {
                      
                  
                        setTravelMode("ACCESSIBLE")
                        setAccessibleMode(true);
                      
                      


                    }}
                  >
                    <FontAwesomeIcon icon={faWheelchair} className="text-xl" />
                  </button>
                  <button
                    className={`rounded-md p-2 mr-4 focus:outline-none ${travelMode === "DRIVING" ? "bg-black-500 text-blue-500" : "bg-black text-white"
                      }`}
                    onClick={() => {
                      
                      setTravelMode("DRIVING")
                      setAccessibleMode(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faCar} className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Destination Section */}
              <div className="bg-white text-black p-10 flex flex-col items-start">
                <div className="flex items-start mb-4 w-full">
                  <div className="flex flex-col items-start w-2/4">
                    <div className="flex items-center mb-2 w-full">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-black text-xl mr-2"
                      />
                      <span className="font-semibold text-gray-600">
                        Destination
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center w-full">
                    {/* Star icon for favoriting */}
                    <FontAwesomeIcon
                      icon={faStar}
                      className={`${isFavorite(searchQuery2) ? 'text-yellow-500' : 'text-black'} text-xl ml-2 cursor-pointer`}
                      onClick={handleSave}
                    />

                    <SearchInput key="editor2"
                      searchQuery={searchQuery2}
                      handleSearchChange={handleSearchChange2}
                      showDropdown={showDropdown2}
                      filteredLocations={filteredLocations2}
                      handleSelect={handleDestinationDropdownSelect}
                      placeholder="Search for destination"
                    />

                  </div>
                </div>

                {/* Favorite destinations */}
                <div className="flex flex-col mb-4 w-full">
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon
                      icon={faRoute}
                      className="text-black text-xl mr-2"
                    />
                    <span className="font-semibold text-gray-600">
                      Favorite Destinations
                    </span>
                  </div>
                  <select
                    className="bg-white border border-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black w-full"
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      handleDestinationDropdownSelect(e.target.value);
                      handleSearchChange2(e);
                    }}
                  >
                    <option value="">Select your favorite Destinaions</option>
                    {favourites.map((location, index) => (
                      <option key={index} value={location.name}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Button */}
                <button
                  className="bg-black text-white rounded-md p-2 w-full mt-4 focus:outline-none hover:bg-gray-600"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={handleStartClick}


                >
                  Start
                </button>
              </div>
            </section>
          </Draggable>
          
        </div>


        {/* Pinned form for mobile/tablet views */}
        <div className="lg:hidden fixed bottom-0 w-full bg-white shadow-lg p-0 rounded-t-md">
          <div className="fixed top-14 right-4 bg-black bg-opacity-50 text-white p-3 rounded-md flex flex-col space-y-2">
            {/* First Label and Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPOIs"
                className="w-4 h-4"
                onChange={(e) => setMarkersVisible(e.target.checked)}

              />
              <label htmlFor="showPOIs" className="text-sm ml-2">
                Show Points of Interest
              </label>
            </div>

            {/* Second Label and Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showRoutes"
                className="w-4 h-4"
                onChange={(e) => setrentalMarkers(e.target.checked)}

              // onChange={handleShowRoutesChange}
              />
              <label htmlFor="showRoutes" className="text-sm ml-2">
                Show Rental Stations
              </label>
            </div>
          </div>


          {/* Travel Mode Options */}
          <div className="flex justify-between items-center mt-4 mb-4 ml-2 mr-2">
            <button className="flex flex-col items-center focus:outline-none ml-5" onClick={() => setTravelMode("DRIVING")}>
              <FontAwesomeIcon
                icon={faCar}
                className={`text-xl mb-1 ${travelMode === "DRIVING" ? "text-blue-500" : "text-black"}`}
              />
              <span className="text-sm text-gray-600">Drive</span>
            </button>

            <button className="flex flex-col items-center focus:outline-none" onClick={() => setTravelMode("WALKING")}>
              <FontAwesomeIcon icon={faWalking}
                className={`text-xl mb-1 ${travelMode === "WALKING" ? "text-blue-500" : "text-black"}`} />
              <span className="text-sm text-gray-600">Walk</span>
            </button>

            <button className="flex flex-col items-center focus:outline-none mr-5" onClick={() => setTravelMode("ACCESSIBLE")}>
              <FontAwesomeIcon icon={faWheelchair}
                className={`text-xl mb-1 ${travelMode === "ACCESSIBLE" ? "text-blue-500" : "text-black"}`} />
              <span className="text-sm text-gray-600">Accessible</span>
            </button>
          </div>

          <div className="flex justify-between items-center mb-4 ">
            <div className="flex items-center w-1/2 ">
              <FontAwesomeIcon icon={faLocationDot} className="text-black text-xl mr-2" />
              <span className="font-semibold text-gray-600">Location</span>
            </div>
            <div className="flex items-center w-1/2 ml-1">
              <FontAwesomeIcon icon={faWalking} className="text-black text-xl mr-2" />
              <SearchInput
                searchQuery={searchQuery1}
                handleSearchChange={handleSearchChange1}
                showDropdown={showDropdown1}
                filteredLocations={filteredLocations1}
                handleSelect={handleLocationDropdownSelect}
                placeholder="Search for location"
                includeMyLocation={true}
                isDark={false}
              />
            </div>
          </div>

          {/* Destination Section */}
          <div className="flex justify-between items-center mb-0 ">
            {/* Label and Input Side by Side */}
            <div className="flex items-center w-full mb-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-black text-xl mr-2" />
              <span className="font-semibold text-gray-600 mr-2">Destination</span>
            </div>


              {/* Input Field */}
              <div className="flex items-center w-full  justify-end">
                <FontAwesomeIcon icon={faStar} 
                className={`${isFavorite(searchQuery2) ? 'text-yellow-500' : 'text-black'} text-xl cursor-pointer`}

                onClick={handleSave}/>

                <SearchInput
                  searchQuery={searchQuery2}
                  handleSearchChange={handleSearchChange2}
                  showDropdown={showDropdown2}
                  filteredLocations={filteredLocations2}
                  handleSelect={handleDestinationDropdownSelect}
                  placeholder="Search for destination"
                  includeFavorites = {true} // New prop to show favorite items

                />
              </div>
          </div>

            {/* Start Button Below */}
            <button
              className="bg-black text-white rounded-md p-2 w-full mt-2 focus:outline-none hover:bg-gray-600"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleStartClick}

            >
              Start
            </button>
          

        </div>

      </main>
    </APIProvider>
  );
}

function Directions({ userPosition, destinationPosition, travelMode }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState();
  const [directionsRenderer, setDirectionsRenderer] = useState();

  if (travelMode === "ACCESSIBLE") {
    travelMode = "WALKING"
  }

  const updateRoute = useCallback(() => {
    if (!directionsService || !directionsRenderer) return;




    directionsService
      .route({
        origin: new google.maps.LatLng(userPosition.lat, userPosition.lng),
        destination: new google.maps.LatLng(destinationPosition.lat, destinationPosition.lng),
        travelMode: google.maps.TravelMode[travelMode], // Ensure travelMode is used here
        provideRouteAlternatives: false,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((error) => console.error("Error updating route:", error));
  }, [directionsService, directionsRenderer, userPosition, destinationPosition, travelMode]);

  useEffect(() => {
    if (!routesLibrary || !map) return;

    const service = new routesLibrary.DirectionsService();
    const renderer = new routesLibrary.DirectionsRenderer({
      map,
      markerOptions: {
        visible: false,
      },
    });

    setDirectionsService(service);
    setDirectionsRenderer(renderer);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (userPosition && destinationPosition) {
      updateRoute(); // Ensure this recalculates the route when travelMode changes
    }
  }, [updateRoute, userPosition, destinationPosition, travelMode]); // Add travelMode as a dependency

  return null;
}

const nightModeMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#bdbdbd" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#373737" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3c3c3c" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: "#4e4e4e" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
];
export default Find;