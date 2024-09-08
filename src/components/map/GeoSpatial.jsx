import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
export default function GeoSpatial({ latitude, longitude, name }) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={20}
      scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>{name}</Popup>
      </Marker>
      {/* Add a Circle component */}
      <Circle
        center={[latitude, longitude]}
        radius={30} // Set the radius in meters
        color="blue"
        fillColor="blue"
        fillOpacity={0.2}
      />
    </MapContainer>
  );
}
