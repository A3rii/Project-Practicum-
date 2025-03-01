import axios from "axios";
import authToken from "../../utils/authToken";

// Api request for list of bookings
export const fetchBookings = async (token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/books/sport-center`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.bookings || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return []; // Return an empty array if there's an error
  }
};

// Fetching sport center information
export const fetchSportCenter = async (sportCenterId) => {
  try {
    const { data } = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/lessor/auth/informations/${sportCenterId}`
    );
    return data.lessor.facilities;
  } catch (err) {
    console.error("Error fetching sport center:", err.message);
    throw err;
  }
};

// Fetch court by the facility
export const fetchCourt = async (facilityId) => {
  const token = authToken();
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/lessor/facility/${facilityId}/courts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.facility.courts;
};
