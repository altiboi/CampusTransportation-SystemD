"use client";

import { useState, useEffect, useCallback } from "react";
import {
  APIProvider,
  Map,
  Marker,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";

function UserTestPage() {
  const [userPosition, setUserPosition] = useState({
    lat: -26.18975877473746,
    lng: 28.0306777946917,
  });
  const [destinationPosition, setDestinationPosition] = useState(null);
  const [destinationInput, setDestinationInput] = useState("");
  const [routeReady, setRouteReady] = useState(false); // Flag to check if route is ready

  const nightModeMapStyles = [
    {
      elementType: "geometry",
      stylers: [{ color: "#212121" }],
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#212121" }],
    },
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

  const handleDestinationChange = (e) => {
    setDestinationInput(e.target.value);
  };

  const handleDestinationSubmit = () => {
    if (destinationInput) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: destinationInput }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const newDestination = results[0].geometry.location;
          setDestinationPosition({
            lat: newDestination.lat(),
            lng: newDestination.lng(),
          });
          setRouteReady(true); // Set the flag to true when the route is ready
        } else {
          console.error(
            "Geocode was not successful for the following reason:",
            status
          );
        }
      });
    }
  };

  return (
    <APIProvider apiKey="AIzaSyBxWXlgW0k0aTUwyanFnudRdqdNp8y413o">
      <div className="flex flex-col items-center pt-20 p-4 bg-gray-900 w-full min-h-screen">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <input
              type="text"
              placeholder="Enter destination address or coordinates"
              value={destinationInput}
              onChange={handleDestinationChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleDestinationSubmit}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Get Route
            </button>
          </div>
          <div className="relative" style={{ height: "50vh" }}>
            <Map
              defaultZoom={14}
              defaultCenter={userPosition}
              options={{ styles: nightModeMapStyles }}
              style={{ width: "100%", height: "100%" }}
            >
              <Marker draggable={false} position={userPosition} />
              {destinationPosition && (
                <>
                  <Marker
                    draggable={true}
                    position={destinationPosition}
                    onDragEnd={(e) => {
                      const newPosition = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                      };
                      setDestinationPosition(newPosition);
                    }}
                  />
                  <Directions
                    userPosition={userPosition}
                    destinationPosition={destinationPosition}
                  />
                </>
              )}
            </Map>
          </div>
        </div>
      </div>
    </APIProvider>
  );
}

export default UserTestPage;

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

// const nightModeMapStyles = [
//   {
//     elementType: "geometry",
//     stylers: [{ color: "#212121" }],
//   },
//   {
//     elementType: "labels.icon",
//     stylers: [{ visibility: "off" }],
//   },
//   {
//     elementType: "labels.text.fill",
//     stylers: [{ color: "#757575" }],
//   },
//   {
//     elementType: "labels.text.stroke",
//     stylers: [{ color: "#212121" }],
//   },
//   {
//     featureType: "administrative",
//     elementType: "geometry",
//     stylers: [{ color: "#757575" }],
//   },
//   {
//     featureType: "administrative.country",
//     elementType: "labels.text.fill",
//     stylers: [{ color: "#9e9e9e" }],
//   },
//   {
//     featureType: "administrative.locality",
//     elementType: "labels.text.fill",
//     stylers: [{ color: "#bdbdbd" }],
//   },
//   {
//     featureType: "poi",
//     elementType: "labels.text.fill",
//     stylers: [{ color: "#757575" }],
//   },
//   {
//     featureType: "poi.park",
//     elementType: "geometry",
//     stylers: [{ color: "#181818" }],
//   },
//   {
//     featureType: "poi.park",
//     elementType: "labels.text.fill",
//     stylers: [{ color: "#616161" }],
//   },
//   {
//     featureType: "road",
//     elementType: "geometry.fill",
//     stylers: [{ color: "#2c2c2c" }],
//   },
//   {
//     featureType: "road",
//     elementType: "labels.text.fill",
//     stylers: [{ color: "#8a8a8a" }],
//   },
//   {
//     featureType: "road.arterial",
//     elementType: "geometry",
//     stylers: [{ color: "#373737" }],
//   },
//   {
//     featureType: "road.highway",
//     elementType: "geometry",
//     stylers: [{ color: "#3c3c3c" }],
//   },
//   {
//     featureType: "road.highway.controlled_access",
//     elementType: "geometry",
//     stylers: [{ color: "#4e4e4e" }],
//   },
//   {
//     featureType: "water",
//     elementType: "geometry",
//     stylers: [{ color: "#000000" }],
//   },
// ];
