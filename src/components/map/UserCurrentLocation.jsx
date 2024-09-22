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
import "leaflet-routing-machine";

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
        routeWhileDragging: true,
        draggableWaypoints: true,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: () => null,
      }).addTo(map);

      return () => map.removeLayer(routingControl);
    }
  }, [waypoints, map]);

  return null;
}

export default function UserCurrentLocation({ latitude, longitude, name }) {
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

  // Create waypoints array, including the user location and destination
  const waypoints =
    userLocation && latitude && longitude
      ? [
          { latitude: userLocation[0], longitude: userLocation[1] },
          { latitude, longitude },
        ]
      : [];

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

      {latitude && longitude && (
        <>
          <Marker position={[latitude, longitude]}>
            <Popup>{name}</Popup>
          </Marker>
          <Circle
            center={[latitude, longitude]}
            radius={100}
            color="blue"
            fillColor="blue"
            fillOpacity={0.2}
          />
        </>
      )}

      {/* Draw route if both locations are available */}
      {waypoints.length > 1 && <DrawRoute waypoints={waypoints} />}
    </MapContainer>
  );
}
