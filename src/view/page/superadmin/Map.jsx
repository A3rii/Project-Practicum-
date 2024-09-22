import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import axios from "axios";
import Loader from "./../../../components/Loader";
import "leaflet/dist/leaflet.css";

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
export default function Map() {
  const {
    data: locations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchSportCentersLocation,
    refetchOnWindowFocus: true,
  });

  const destinations = locations
    ? locations.map((data) => ({
        latitude: data.location.coordinates[1],
        longitude: data.location.coordinates[0],
        name: data.sportcenter_name,
      }))
    : [];
  if (isLoading) return <Loader />;
  if (error) return <p>Error loading locations</p>;

  return (
    <MapContainer
      center={[11.576337732358134, 104.92334082407501]}
      zoom={12}
      scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {destinations.map((destination, key) => (
        <div key={key}>
          <Marker position={[destination.latitude, destination.longitude]}>
            <Popup>{destination.name}</Popup>
          </Marker>
          <Circle
            center={[destination.latitude, destination.longitude]}
            radius={150}
            color="red"
            fillColor="red"
            fillOpacity={0.2}
          />
        </div>
      ))}
    </MapContainer>
  );
}
