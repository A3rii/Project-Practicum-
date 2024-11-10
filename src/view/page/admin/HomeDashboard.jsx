import {
  Table,
  TableCell,
  TableHead,
  Paper,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
  Grid,
  Divider,
  Box,
  TextField,
} from "@mui/material";
import CountUp from "react-countup";
import { useState, useMemo } from "react";
import {
  formatDate,
  totalHour,
  parseTimeToDate,
} from "../../../utils/timeCalculation";
import { useQuery } from "@tanstack/react-query";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import BookIcon from "@mui/icons-material/Book";
import dayjs from "dayjs";
import Loader from "../../../components/Loader";
import BookingChart from "../../../components/AdminComponent/Chart/BookingChart";
import RatingChart from "../../../components/AdminComponent/Chart/RatingChart";

import { dashboardAPI } from "../../../api/admin/index";

// Custom hook for data fetching
const useBookingsData = (queryKey, selectFn) =>
  useQuery({
    queryKey: [queryKey],
    queryFn: dashboardAPI.fetchBookings,
    select: selectFn,
    refetchOnWindowFocus: true,
  });

// InfoCard component for reusable card structure
const InfoCard = ({ title, value, icon: Icon, color }) => (
  <Paper
    sx={{
      width: "100%",
      height: "100%",
      overflow: "hidden",
      padding: "15px",
      backgroundColor: color,
      color: "#fff",
      borderRadius: "1rem",
    }}
    elevation={5}>
    <Typography variant="h5" sx={{ fontWeight: "bold", padding: "14px" }}>
      {title}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", paddingLeft: ".8rem" }}>
      <Icon sx={{ fontSize: "2rem" }} />
      <Typography
        sx={{ padding: "14px", fontSize: "2rem", fontWeight: "bold" }}>
        <CountUp start={0} end={parseInt(value)} duration={2.5} />
      </Typography>
    </Box>
  </Paper>
);

// Dashboard components
function TotalCustomer() {
  const {
    data: totalUsers,
    isLoading,
    isError,
  } = useBookingsData(
    "totalUsers",
    (bookings) =>
      new Set(bookings.map((b) => b.user?._id || b.outside_user)).size
  );
  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching data</p>;

  return (
    <InfoCard
      title="Total Customer"
      value={totalUsers}
      icon={AccountCircleIcon}
      color="#2E8BC0"
    />
  );
}

function MatchAcception() {
  const {
    data: totalBooking,
    isLoading,
    isError,
  } = useBookingsData(
    "totalBooking",
    (bookings) => bookings.filter((b) => b.status === "approved").length
  );
  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching data</p>;

  return (
    <InfoCard
      title="Match Acception"
      value={totalBooking}
      icon={AccessAlarmsIcon}
      color="#50C878"
    />
  );
}

function TotalBooking() {
  const {
    data: totalBookings,
    isLoading,
    isError,
  } = useBookingsData("totalBookings", (bookings) => bookings.length);
  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching data</p>;

  return (
    <InfoCard
      title="Total Booking"
      value={totalBookings}
      icon={BookIcon}
      color="#A98EC0"
    />
  );
}

// Customer Table component
function CustomerTable() {
  const [userName, setUserName] = useState("");
  const {
    data: customers,
    isLoading,
    isError,
  } = useBookingsData("customers", (bookings) => {
    const userBookingCounts = {};
    bookings.forEach((booking) => {
      const userId = booking.user
        ? booking.user._id
        : booking.outside_user.name;
      const userInfo = booking.user ? booking.user : booking.outside_user;

      if (!userBookingCounts[userId]) {
        userBookingCounts[userId] = {
          count: 1,
          user: userInfo,
        };
      } else {
        userBookingCounts[userId].count++;
      }
    });

    const uniqueUsersArray = Object.values(userBookingCounts).map(
      ({ user, count }) => ({
        ...user,
        count,
      })
    );

    return uniqueUsersArray;
  });

  const filteredUsers = useMemo(
    () =>
      userName
        ? customers.filter((user) =>
            user.name.toLowerCase().includes(userName.toLowerCase())
          )
        : customers,
    [userName, customers]
  );

  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching data</p>;

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
        marginTop: "1rem",
        borderRadius: "1rem",
      }}
      elevation={5}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Customer
        </Typography>
        <TextField
          onChange={(e) => setUserName(e.target.value)}
          size="small"
          sx={{ width: "20rem" }}
          label="Search"
        />
      </Box>
      <Divider />
      <TableContainer sx={{ maxHeight: "20rem" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone number</TableCell>
              <TableCell>Amount Booking</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.name || row.outside_user}</TableCell>
                <TableCell>{row.email || "N/A"}</TableCell>
                <TableCell>{row.phone_number || "N/A"}</TableCell>
                <TableCell>{row.count || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

// Upcoming Match component
const UpcomingMatch = () => {
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
  console.log(cambodianTimeZone());

  const {
    data: matches,
    isLoading,
    isError,
  } = useBookingsData("upcomingMatch", (bookings) => {
    // Get the current time in Cambodian timezone formatted as "HH:mm"
    const currentCambodianTime = cambodianTimeZone(); // Ensure this returns the time in "HH:mm" format
    const formattedCurrentTime = parseTimeToDate(currentCambodianTime); // Parse it to a comparable format

    return bookings.filter((b) => {
      const formattedDate =
        formatDate(b.date) === dayjs(new Date()).format("MMMM DD, YYYY");
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
        height: "100%",
        overflow: "hidden",
        padding: "15px",
        marginTop: "1rem",
        borderRadius: "1rem",
      }}
      elevation={5}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
        Today Match
      </Typography>
      <Divider />
      <TableContainer sx={{ maxHeight: "20rem" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone number</TableCell>
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
                <TableCell colSpan={6} align="center">
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

export default function AdminDashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <TotalBooking />
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <TotalCustomer />
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <MatchAcception />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={8}>
        <BookingChart />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={4}>
        <RatingChart />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={6}>
        <CustomerTable />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={6}>
        <UpcomingMatch />
      </Grid>
    </Grid>
  );
}
