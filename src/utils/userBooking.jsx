export default function userBooking(bookings, sportCenterId, facility) {
  let arrayOfMostTimeBooked = [];

  // Filter the bookings by sportCenterId and facility
  const filteredBookings = bookings?.filter(
    (booking) =>
      booking?.lessor?._id === sportCenterId && booking?.facility === facility
  );

  // Find the first duplicate based on startTime and endTime
  const duplicateBooking = filteredBookings?.find((booking, index) => {
    return filteredBookings.some((otherBooking, otherIndex) => {
      // Ensure it's not comparing the same booking by checking the index
      return (
        index !== otherIndex &&
        booking.startTime === otherBooking.startTime &&
        booking.endTime === otherBooking.endTime
      );
    });
  });

  // If duplicateBooking is found, add it to the array
  if (duplicateBooking) {
    arrayOfMostTimeBooked.push(duplicateBooking);
  }

  // Return the array with the duplicate booking (or an empty array if none are found)
  return arrayOfMostTimeBooked.length > 0 ? arrayOfMostTimeBooked : null;
}
