import axios from "axios";
import authToken from "./../../utils/authToken";
// Fetching time availability
const fetchTime = async (sportCenterId, date, facility, court) => {
  const { data } = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }/books/lessors/${sportCenterId}/time-slots/availability`,
    { params: { date, facility, court } }
  );
  return data.bookings.filter(({ status }) => ["approved"].includes(status));
};

// Fetching court details
const fetchCourt = async (facilityId) => {
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

export { fetchTime, fetchCourt };
