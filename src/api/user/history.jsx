import axios from "axios";

const fetchBookings = async (token, filter) => {
  try {
    const bookings = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/booking`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const incoming = bookings.data.booking;

    if (filter === "all") {
      const filteredMatches = incoming.filter(
        (booking) =>
          booking.status === "approved" || booking.status === "rejected"
      );
      return filteredMatches;
    }

    if (filter) {
      const bookingMatch = incoming.filter(
        (booking) => booking.status === filter
      );
      return bookingMatch;
    }

    return incoming;
  } catch (err) {
    throw new Error(err.message);
  }
};

export { fetchBookings };
