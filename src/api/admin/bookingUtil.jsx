import axios from "axios";
import authToken from "../../utils/authToken";
import { formatDate } from "../../utils/timeCalculation";

//* Fetch all pending bookings with optional facility and court filters
export const fetchBookings = async (page, facility, court, date) => {
  const token = authToken();
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/books/customer/pagination`,
    {
      params: { page, limit: 4 },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const bookings = response.data.bookings;
  return bookings.filter(
    (booking) =>
      booking.status === "pending" &&
      (!facility || booking.facility === facility) &&
      (!court || booking.court === court) &&
      (!date || formatDate(booking.date) === formatDate(date))
  );
};

//* Check and reject expired pending bookings
export const fetchAndProcessExpiredBookings = async () => {
  const token = authToken();
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/books/sport-center`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const bookings = response.data.bookings;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const promises = bookings.map(async (booking) => {
    const bookingDate = new Date(booking.date);
    if (bookingDate < currentDate && booking.status === "pending") {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/books/${booking._id}/status`,
        { status: "rejected" },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  });

  await Promise.all(promises);
  return bookings;
};

//* Update booking status
export const updateBookingStatus = async ({ status, bookingId }) => {
  const token = authToken();
  const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/books/${bookingId}/status`,
    { status },
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

//* Fetch sport center information by ID
export const fetchSportCenter = async (sportCenterId) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/lessor/auth/informations/${sportCenterId}`
  );
  return data.lessor.facilities;
};

//* Fetch courts by facility ID
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

export const updateMultipleBookingStatus = async ({ status, bookingIds }) => {
  const token = authToken();
  const updatePromises = bookingIds.map((bookingId) =>
    axios.put(
      `${import.meta.env.VITE_API_URL}/books/${bookingId}/status`,
      { status },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );

  // Execute all requests in parallel
  const responses = await Promise.all(updatePromises);
  return responses.map((response) => response.data);
};
