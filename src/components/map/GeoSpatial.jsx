import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function GeoSpatial({
  latitude,
  longitude,
  name,
  onLocationChange, 
}) {
  // Handling null values if map is null
  const defaultCenter = [11.598824446578117, 104.9272459050655];
  const mapCenter =
    latitude && longitude ? [latitude, longitude] : defaultCenter;

  // Selecting by click on the geo map
  function LocationSelector() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onLocationChange(lat, lng); // Update the coordinates on map click
      },
    });

    return null;
  }

  return (
    <MapContainer
      center={mapCenter} // Use the computed map center
      zoom={20}
      scrollWheelZoom={false}
      style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {latitude && longitude && (
        <>
          <Marker position={[latitude, longitude]}>
            <Popup>{name}</Popup>
          </Marker>
          <Circle
            center={[latitude, longitude]}
            radius={30}
            color="blue"
            fillColor="blue"
            fillOpacity={0.2}
          />
        </>
      )}
      <LocationSelector />
    </MapContainer>
  );
}
