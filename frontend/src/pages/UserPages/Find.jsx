import React, { useState, useEffect, useCallback } from "react";
import {Link} from "react-router-dom"

import Card from "../../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faRoute,
  faPersonWalking,
  faCar,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./Find.scss";
import { useAppContext } from "../../contexts/AppContext";
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

function Find() {
  const { setTitle, setTask } = useAppContext();

  const [currentLocation, setCurrentLocation] = useState({ lat: -26.190424531742913, lng: 28.0259034605168 });
  const [destinationPosition, setDestinationPosition] = useState({
    lat: -26.19010710587139,
    lng: 28.030646555352817,
  });

  useEffect(() => {
    setTitle("Find");
    setTask(1);

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
  }, [setTitle, setTask]);

  return (
    <APIProvider apiKey="AIzaSyBxWXlgW0k0aTUwyanFnudRdqdNp8y413o">
      <main className="find-main-container">
        <section className="find-upper-part">
          {/* Map Section */}
          <section className="find-Map find-w-1/2">
            {currentLocation ? (
              <div style={{ height: "100%", width: "100%" }}>
                <Map
                  defaultZoom={14}
                  defaultCenter={currentLocation}
                  options={{ styles: nightModeMapStyles }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Marker position={currentLocation} />
                  <Marker position={destinationPosition} />
                  <Directions userPosition={currentLocation} destinationPosition={destinationPosition} />
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
              </section>
            </Card>
            <Card className="find-upper-card">
              <section className="find-card-icon">
                <FontAwesomeIcon icon={faCheckCircle} className="icon" />
              </section>
              <section>
                <Link to={'/UserWhereTo'}>
                <h2 className="find-card-title">Destination</h2>
                </Link>
              </section>
            </Card>
          </section>
          <section className="find-lower-section">
            <Card className="find-lower-card-section">
              <section className="find-card-icon">
                <FontAwesomeIcon icon={faPersonWalking} />
              </section>
              <section className="find-card-content">
                <span className="find-card-title">Walk</span>
              </section>
            </Card>
            <Card className="find-lower-card-section">
              <section className="find-card-icon">
                <FontAwesomeIcon icon={faRoute} />
              </section>
              <section className="find-card-content">
                <span className="find-card-title">View Routes</span>
              </section>
            </Card>
            <Card className="find-lower-card-section">
              <section className="find-card-icon">
                <FontAwesomeIcon icon={faCar} />
              </section>
              <section className="find-card-content">
                <span className="find-card-title">Vehicle</span>
              </section>
            </Card>
          </section>
        </section>
      </main>
    </APIProvider>
  );
}

function Directions({ userPosition, destinationPosition }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState();
  const [directionsRenderer, setDirectionsRenderer] = useState();

  const updateRoute = useCallback(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService
      .route({
        origin: new google.maps.LatLng(userPosition.lat, userPosition.lng),
        destination: new google.maps.LatLng(
          destinationPosition.lat,
          destinationPosition.lng
        ),
        travelMode: google.maps.TravelMode.WALKING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      });
  }, [
    directionsService,
    directionsRenderer,
    userPosition,
    destinationPosition,
  ]);

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
  }, [updateRoute, userPosition, destinationPosition]);

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
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
];

export default Find;