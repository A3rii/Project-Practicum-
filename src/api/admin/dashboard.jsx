import axios from "axios";
import authToken from "./../../utils/authToken";

// Utility for centralized fetching
const fetchBookings = async () => {
  const token = authToken();
  const headers = { Authorization: `Bearer ${token}` };
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/books/sport-center`,
    { headers }
  );
  return data.bookings || [];
};

export { fetchBookings };
