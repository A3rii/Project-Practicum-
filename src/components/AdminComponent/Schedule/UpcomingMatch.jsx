import {
  Table,
  TableCell,
  TableHead,
  Paper,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
  Divider,
} from "@mui/material";
import {
  formatDate,
  totalHour,
  parseTimeToDate,
} from "../../../utils/timeCalculation";
import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "../../../api/admin/index";

import dayjs from "dayjs";
import Loader from "../../../components/Loader";

const useBookingsData = (queryKey, selectFn) =>
  useQuery({
    queryKey: [queryKey],
    queryFn: dashboardAPI.fetchBookings,
    select: selectFn,
    refetchOnWindowFocus: true,
  });
export const UpcomingMatch = () => {
  // Cambodian TimeZone formatation
  const cambodianTimeZone = () => {
    const date = new Date();
    const cambodianHourMinute = date.toLocaleTimeString("en-US", {
      timeZone: "Asia/Phnom_Penh",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return cambodianHourMinute;
  };

  const {
    data: matches,
    isLoading,
    isError,
  } = useBookingsData("upcomingMatch", (bookings) => {
    // Get the current time in Cambodian timezone formatted as "HH:mm"
    const currentCambodianTime = cambodianTimeZone(); // Ensure this returns the time in "HH:mm" format
    const formattedCurrentTime = parseTimeToDate(currentCambodianTime); // Parse it to a comparable format

    return bookings.filter((b) => {
      // If the booking is far a head of the current date, which means it is an upcoming
      const formattedDate =
        formatDate(b.date) > dayjs(new Date()).format("MMMM DD, YYYY");
      const isApproved = b.status === "approved";

      // Compare endTime with the current time
      const endTimeInFormatted = parseTimeToDate(b.endTime); // Parse endTime to "HH:mm" format

      // Return the filtering condition based on time comparison
      return (
        formattedDate &&
        isApproved &&
        endTimeInFormatted >= formattedCurrentTime
      );
    });
  });

  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching data</p>;

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        overflow: "hidden",
        padding: "15px",
      }}
      elevation={0}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
        Upcoming Match
      </Typography>
      <Divider />
      <TableContainer
        sx={{
          maxHeight: "20rem",
          overflowX: "auto",
        }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Facility</TableCell>
              <TableCell>Court</TableCell>
              <TableCell>Hour</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.length ? (
              matches.map((match, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {match.user?.name || match.outside_user?.name}
                  </TableCell>
                  <TableCell>
                    {match.user?.phone_number ||
                      match.outside_user?.phone_number}
                  </TableCell>
                  <TableCell>{match.facility}</TableCell>
                  <TableCell>{match.court}</TableCell>
                  <TableCell>
                    {totalHour(match.startTime, match.endTime)}
                  </TableCell>
                  <TableCell>
                    {match.startTime}-{match.endTime}
                  </TableCell>
                  <TableCell>{formatDate(match.date)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Match for today
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
