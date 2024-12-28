import axios from "axios";
import authToken from "./../../utils/authToken"; //* fetching user booking API

const fetchUserBookings = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/booking`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken()}`,
        },
      }
    );

    return data.booking;
  } catch (err) {
    throw new Error(err);
  }
};

//* Fetching sport center informations API
const fetchSportCenter = async (sportCenterId) => {
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

//* Fetching time availablility API
const fetchTime = async (sportCenterId, date, facility, court) => {
  try {
    const { data } = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/books/lessors/${sportCenterId}/time-slots/availability`,
      {
        params: { date, facility, court },
      }
    );
    return data.bookings.filter((booking) =>
      ["approved"].includes(booking.status)
    );
  } catch (err) {
    console.log(err.message);
    throw new Error("Failed to fetch time slots");
  }
};

export { fetchUserBookings, fetchSportCenter, fetchTime };
