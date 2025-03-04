import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "./../Loader";
import axios from "axios";
import "leaflet-routing-machine";

// Fetch sport centers location
const fetchSportCentersLocation = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/location/sportcenters/destination`
    );
    return data.coordinates;
  } catch (err) {
    throw new Error(err);
  }
};

const DrawRoute = ({ userLocation, destinations }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation && destinations.length > 0) {
      const routingControls = destinations.map((destination) => {
        const waypoints = [
          window.L.latLng(userLocation[0], userLocation[1]),
          window.L.latLng(destination.latitude, destination.longitude),
        ];

        const control = window.L.Routing.control({
          waypoints: waypoints,
          lineOptions: {
            styles: [{ color: "#6FA1EC", weight: 4 }],
          },
          routeWhileDragging: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          showAlternatives: false,
          createMarker: () => null,
        }).addTo(map);

        return control;
      });

      // Cleanup function to remove routing controls
      return () =>
        routingControls.forEach((control) => {
          if (control) map.removeControl(control);
        });
    }
  }, [userLocation, destinations, map]);

  return null;
};

// Correctly update location in SetViewOnLocationChange
const SetViewOnLocationChange = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView(location, map.getZoom()); // Use setView properly
    }
  }, [location, map]);

  return null;
};

export default function AllSportCenter() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]); // Correctly set as an array
          console.log("User location set to:", { latitude, longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const {
    data: locations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchSportCentersLocation,
    refetchOnWindowFocus: true,
  });
  console.log(locations);

  const destinations = locations
    ? locations?.map((data) => ({
        latitude: data.location.coordinates[1],
        longitude: data.location.coordinates[0],
        name: data.sportcenter_name,
      }))
    : [];

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading locations</p>;

  return (
    <MapContainer
      center={userLocation || [11.598824446578117, 104.9272459050655]} // Use default center if no user location
      zoom={12}
      scrollWheelZoom={false}
      style={{ height: "100vh", width: "100%" }} // Ensure the map container has size
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userLocation && (
        <>
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>
          <Circle
            center={userLocation}
            radius={100}
            color="blue"
            fillColor="blue"
            fillOpacity={0.2}
          />
          <SetViewOnLocationChange location={userLocation} />
        </>
      )}

      {destinations.map((destination, key) => (
        <>
          <Marker
            key={key}
            position={[destination.latitude, destination.longitude]}>
            <Popup>{destination.name}</Popup>
          </Marker>
          <Circle
            center={[destination.latitude, destination.longitude]}
            radius={100}
            color="red"
            fillColor="red"
            fillOpacity={0.2}
          />
        </>
      ))}

      {userLocation && (
        <DrawRoute userLocation={userLocation} destinations={destinations} />
      )}
    </MapContainer>
  );
}
