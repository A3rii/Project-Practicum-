import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import "leaflet-routing-machine"; // Import Leaflet Routing Machine

const locations = [
  {
    latitude: 11.580453694384412,
    longitude: 104.91050089206516,
    city: "Liuzhi",
    country: "China",
  },
  {
    latitude: 11.588014571444408,
    longitude: 104.92847840873094,
    city: "That Phanom",
    country: "Thailand",
  },
];

function SetViewOnLocationChange({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView(location, map.getZoom());
    }
  }, [location, map]);

  return null;
}

function DrawRoute({ waypoints }) {
  const map = useMap();

  useEffect(() => {
    if (waypoints.length > 1) {
      const routingControl = window.L.Routing.control({
        waypoints: waypoints.map((point) =>
          window.L.latLng(point.latitude, point.longitude)
        ),
        lineOptions: {
          styles: [{ color: "#6FA1EC", weight: 4 }],
        },
        createMarker: () => null, // Disable markers for each point
      }).addTo(map);

      return () => map.removeControl(routingControl);
    }
  }, [waypoints, map]);

  return null;
}

export default function UserCurrentLocation() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
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

  const defaultCenter = [11.598824446578117, 104.9272459050655];

  // Add the user location to the start of the waypoints array
  const waypoints = userLocation
    ? [{ latitude: userLocation[0], longitude: userLocation[1] }, ...locations]
    : locations;

  return (
    <MapContainer
      center={userLocation ? userLocation : defaultCenter}
      zoom={20}
      scrollWheelZoom={false}>
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
            color="red"
            fillColor="red"
            fillOpacity={0.2}
          />
          <SetViewOnLocationChange location={userLocation} />
        </>
      )}
      {locations.map((coordinate, key) => (
        <Marker
          key={key}
          position={[coordinate.latitude, coordinate.longitude]}>
          <Popup>{coordinate.city}</Popup>
          <Circle
            center={[coordinate.latitude, coordinate.longitude]}
            radius={100}
            color="red"
            fillColor="red"
            fillOpacity={0.2}
          />
        </Marker>
      ))}
      <DrawRoute waypoints={waypoints} />
    </MapContainer>
  );
}
