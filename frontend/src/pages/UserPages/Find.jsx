import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { getAllLocations, addToFavourites, getFavourites } from "../../api/functions"; // Import your Firebase function
import Card from "../../components/Card";
import dininghall from "../../assets/dininghalls.png";
import clubvenue from "../../assets/clubvenue.png"
import wheelchair from "../../assets/acc_entrance.png"
import home from "../../assets/home.png";
import landmark from "../../assets/time.png";
import sports from "../../assets/sport.png";
import religion from "../../assets/church.png";
import shopping from "../../assets/shopping.png";
import community from "../../assets/community.png";
import danger from "../../assets/danger-point.png"; // Path to your rental station icon
import axios from "axios"; // Import axios
import Modal from 'react-modal'; // If using react-modal

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faSave,
  faRoute,
  faPersonWalking,
  faCar,
  faCheckCircle,
  faWheelchair,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import "./Find.scss";
import { useAppContext } from "../../contexts/AppContext";
import {  APIProvider, Map, Marker, useMap, useMapsLibrary, InfoWindow } from "@vis.gl/react-google-maps";
import { useAuth } from "../../contexts/AuthProvider";

function Find() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const { setTitle, setTask } = useAppContext();
  const {currentUser} = useAuth()
  const [currentLocation, setCurrentLocation] = useState({ lat: -26.190424531742913, lng: 28.0259034605168 });
  const [destinationPosition, setDestinationPosition] = useState({ lat: -26.19010710587139, lng: 28.030646555352817 });
  const [travelMode, setTravelMode] = useState("WALKING"); // Use string instead of google.maps.TravelMode
  const [destinationName, setDestinationName] = useState(""); // State for destination name
  const [pointsofinterest, setpointsofinterest] = useState([]);  // Store fetched locations
  const [markersVisible, setMarkersVisible] = useState(false); // State for marker visibility
  const [activeMarker, setActiveMarker] = useState(null);
  const [activeIncidents, setActiveIncidents] = useState([]); // State to hold active incidents
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isSaved, setIsSaved] = useState(null);
  const [favourites, setFavourites] = useState([]); // State to hold active incidents
  const [accessibleMode, setAccessibleMode] = useState(false); // New state for accessible mode



  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const destinationParam = queryParams.get("destination");
  const apiKey = import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY;


  const fetchPOIs = async () => {
    try {
      const allLocations = await getAllLocations();
      const POIs = allLocations.filter(location => location.category);
      setpointsofinterest(POIs);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const  fetchFavouirites = async()=>{
    try{
      const favourites = await getFavourites(currentUser.email);
      console.log(favourites)
      setFavourites(favourites)

    }catch (error) {
      console.error("Error fetching favourite locations:", error);
    }
  }

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('https://campussafetyapp.azurewebsites.net/incidents/all-incidents');
      const activeIncidents = response.data.filter(incident => incident.active === 1);
      setActiveIncidents(activeIncidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };




  useEffect(() => {
    setTitle("Find");
    setTask(1);

    fetchPOIs();
    fetchIncidents();
    fetchFavouirites();


    

    // Handle user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
          setCurrentLocation({ lat: -26.190424531742913, lng: 28.0259034605168 });
        }
      );
    } else {
      setCurrentLocation({ lat: -26.190424531742913, lng: 28.0259034605168 });
    }

    console.log(currentUser.email)

    const intervalId = setInterval(() => {
      fetchIncidents();
    }, 1800000); // 30 minutes in milliseconds

    // Cleanup the interval on unmount
    return () => clearInterval(intervalId);
  }, [setTitle, setTask]);




  

  function formatDate(incidentDate) {
    const { day, month, year, time } = incidentDate;
    const formattedTime = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} at ${formattedTime}`;
  }

  const handleIncidentClick = (incident) => {
    setSelectedIncident(incident); // Set the selected incident
  };

  const handleSave = async (dest) => {
    try {
      await addToFavourites(currentUser.email, dest);
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving destination:', error);
    }
  };

  useEffect(() => {
    if (destinationParam) {
      try {
        // Parse the destination JSON
        const destination = JSON.parse(decodeURIComponent(destinationParam));
       
        const { coordinates } = destination;

        // Set destination position using the parsed coordinates
        if (coordinates) {
          setDestinationPosition({
            lat: coordinates.latitude,
            lng: coordinates.longitude
          });
        }

        if (destination.name) {
          setDestinationName(destination.name);
        }
      } catch (error) {
        console.error("Error parsing destination:", error);
      }
    }
  }, [destinationParam]);

  const toggleMarkers = () => {
    setMarkersVisible((prev) => !prev);
  };

  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
  };

  const toggleTravelMode = () => {
    if (travelMode === "WALKING") {
      setTravelMode("DRIVING");
      setAccessibleMode(false); 

     
    } else if (travelMode === "DRIVING") {
      const building = JSON.parse(decodeURIComponent(destinationParam));

      
      setAccessibleMode(true); 
     
      setTravelMode("ACCESSIBLE");

    } else {
      setTravelMode("WALKING");
      setAccessibleMode(false); 

     
    }
  };

  // Use useEffect to watch for changes in accessibleMode
useEffect(() => {
  const building = JSON.parse(decodeURIComponent(destinationParam));
  if (accessibleMode && building) {
    adjustToAccessibleEntrance(building); // Now call this function when accessibleMode becomes true
  }
}, [accessibleMode, destinationParam]); // Depend on accessibleMode and destinationParam

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
      console.log("No accessible entrance found.");
    }
  } else {
    console.log("Accessible mode is not enabled or no entrances available.");
  }
};


  return (
    <APIProvider apiKey="AIzaSyBxWXlgW0k0aTUwyanFnudRdqdNp8y413o">
      <main className="find-main-container">

        <section className="find-upper-part">
          {/* Map Section */}
          <section className="find-Map find-w-1/2">
            {currentLocation ? (
              <div style={{ height: "100%", width: "100%" }}>
                <Map
                  defaultZoom={17}
                  defaultCenter={currentLocation}
                  options={{ styles: nightModeMapStyles }}
                  style={{ width: "100%", height: "100%" }}
                >
                   
                  <Marker position={currentLocation} />
                  <Marker position={destinationPosition} />

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
                      scaledSize: new google.maps.Size(25, 25), // Adjust size
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

                    {/* Markers for accessible entrances */}
                  {accessibleMode && 
                    JSON.parse(decodeURIComponent(destinationParam)).accessible_entrances?.map((entrance, entranceIndex) => (
                      
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






                  <Directions
                    userPosition={currentLocation}
                    destinationPosition={destinationPosition}
                    travelMode={travelMode}
                  />
                </Map>
              </div>
            ) : (
              <p>Loading map...</p>
            )}
          </section>
        </section>

        <section className="find-lower-part">
          <section className="find-w-full p-2">
            <h2 className="find-card-title find-title">Select Location</h2>
          </section>
          <section className="find-upper-section find-w-full find-flex find-justify-around">
            <Card className="find-upper-card">
              <section className="find-card-icon">
                <FontAwesomeIcon icon={faLocationDot} className="icon" />
              </section>
              <section>
                <h2 className="find-card-title">Location</h2>
                {/* <h2 className="find-place">Barnato Hall</h2> */}
              </section>
            </Card>
            <Card className="find-upper-card">
              <section className="find-card-icon">
                <FontAwesomeIcon icon={faCheckCircle} className="icon" />
              </section>
              <section>
                <Link to={'/UserWhereTo'}>
                  <h2 className="find-card-title">Destination</h2>
                  <h2 className="find-place">{destinationName}</h2>
                </Link>
                <button className={`save-button`}
                onClick={() => handleSave(destinationParam)}
                  style={{
                    marginLeft: 'auto',
                    color: isSaved?'black':'grey',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '10px',
                    borderRadius: '50%',
                  }}>
                  <FontAwesomeIcon icon={faSave} size="lg" />
                </button>              
              </section>
            </Card>
          </section>
          <section className="find-lower-section">
          <Card className={`find-lower-card-section ${travelMode === "WALKING" ? 'selected' : ''}`} onClick={toggleTravelMode}>
              <section className="find-card-content">
                <span className="find-card-title">{travelMode === "WALKING" ? "Drive" : travelMode === "DRIVING" ? "Accessible" : "Walk"}</span>
              </section>
              <section className="find-card-icon">
                <FontAwesomeIcon icon={travelMode === "WALKING" ? faCar : travelMode === "DRIVING" ? faWheelchair : faPersonWalking} />
              </section>
            </Card>
            <Card
              className={`find-lower-card-section ${travelMode === "DRIVING" ? 'selected' : ''}`}
              onClick={toggleMarkers} // Toggle markers on click

            >
              <section className="find-card-content">
                <span className="find-card-title">Points of Interest</span>
              </section>
              <section className="find-card-icon">
                <FontAwesomeIcon icon={faRoute} />
              </section>
            </Card>

            <Card
              className="find-lower-card-section"
              onClick={toggleModal}
            >
              <section className="find-card-content">
                <span className="find-card-title">View Favorites</span>
              </section>
              <section className="find-card-icon">
                <FontAwesomeIcon icon={faStar} />
              </section>
            </Card>
          </section>
        </section>
         {/* Modal for displaying favourites */}
         <Modal isOpen={isModalOpen} onRequestClose={toggleModal} contentLabel="Favourites Modal">
          <h2>My Favourite Locations</h2>
          <ul>
            {favourites.map((fav, index) => (
              <li key={index}>{fav?.name}</li> // Assuming fav has a 'name' property
            ))}
          </ul>
          <button onClick={toggleModal}>Close</button>
        </Modal>
      </main>
    </APIProvider>
  );
}

function Directions({ userPosition, destinationPosition, travelMode }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState();
  const [directionsRenderer, setDirectionsRenderer] = useState();

  if(travelMode==="ACCESSIBLE"){
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
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "road", elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#646464" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#f2f2f2" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
];

export default Find;