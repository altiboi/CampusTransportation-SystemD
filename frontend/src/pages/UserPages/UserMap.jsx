import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../contexts/AppContext";
import './UserMap.scss';
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps"; // Replace with actual map library
import rentalStationIcon from "../../assets/rental.png"; // Path to your rental station icon
import { Link } from "react-router-dom"; // Import Link
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // Import the back icon
import { getAllRentalStations } from "../../api/functions";

function UserMap() {
  const { setTitle, setTask } = useAppContext();
  const [currentLocation, setCurrentLocation] = useState({ lat: -26.190424531742913, lng: 28.0259034605168 });
  const [rentalStations, setRentalStations] = useState([]);
  const [showMessage, setShowMessage] = useState(true);
  const [destinationPosition, setDestinationPosition] = useState(null); // State to hold the selected destination

  // Fetch stations data
  const fetchStations = async () => {
    try {
      const allLocations = await getAllRentalStations();
      const POIs = allLocations.filter(location => location.location);
      setRentalStations(POIs);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    setTitle("Find Rental Stations");
    setTask(1);
    fetchStations();

    // Set user's current location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          console.log(currentLocation)
        },
        (error) => {
          console.error("Error getting user location:", error);
          setCurrentLocation({ lat: -26.190424531742913, lng: 28.0259034605168 });
        }
      );
    } else {
      setCurrentLocation({ lat: -26.190424531742913, lng: 28.0259034605168 });
    }
  }, [setTitle, setTask]);

  // Function to handle marker click
  const handleMarkerClick = (stationLocation) => {
    setShowMessage(false); // Hide the message when a rental station marker is clicked
    setDestinationPosition({ lat: stationLocation.latitude, lng: stationLocation.longitude }); // Set the destination position
  
  };

  return (
    <main className="Map-container">
      <Link to="/home" className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} className='text-xl' />
      </Link>
      <div className="relative">
        <APIProvider apiKey="AIzaSyBxWXlgW0k0aTUwyanFnudRdqdNp8y413o"> {/* Replace with actual key */}
          {currentLocation ? (
            <div style={{ height: "100vh", width: "100%" }}>
              {/* Display the message */}
              {showMessage && (
                <div className="message-container">
                  <p>Click on icon to get directions</p>
                </div>
              )}

              <Map
                defaultZoom={16}
                defaultCenter={currentLocation}
                style={{ width: "100%", height: "100%" }}
                options={{ styles: nightModeMapStyles }}
              >
                <Marker position={currentLocation} />

                {rentalStations.map((station, index) => (
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
                
                {/* Render Directions component if a destination is selected */}
                {destinationPosition && (
                  <Directions
                    userPosition={currentLocation}
                    destinationPosition={destinationPosition}
                    travelMode="WALKING"
                  />
                )}
              </Map>
            </div>
          ) : (
            <p>Loading map...</p>
          )}
        </APIProvider>
      </div>
    </main>
  );
}

function Directions({ userPosition, destinationPosition, travelMode }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  const updateRoute = useCallback(() => {
    if (!directionsService || !directionsRenderer) return;

    // Clear previous directions before rendering new ones
    directionsRenderer.setDirections(null);

    directionsService
      .route({
        origin: new google.maps.LatLng(userPosition.lat, userPosition.lng),
        destination: new google.maps.LatLng(destinationPosition.lat, destinationPosition.lng),
        travelMode: google.maps.TravelMode[travelMode],
        provideRouteAlternatives: false, // Ensure only one route is returned
      })
      .then((response) => {
        directionsRenderer.setDirections(response); // Set new route
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
      updateRoute();
    }
  }, [updateRoute, userPosition, destinationPosition, travelMode]);

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

export default UserMap;
