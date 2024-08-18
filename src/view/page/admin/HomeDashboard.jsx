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
import { useState, useMemo } from "react";
import { formatDate, totalHour } from "./../../../utils/timeCalculation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import authToken from "../../../utils/authToken";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import BookIcon from "@mui/icons-material/Book";
import dayjs from "dayjs";
import Loader from "./../../../components/Loader";
import BookingChart from "../../../components/AdminComponent/Chart/BookingChart";
import RatingChart from "./../../../components/AdminComponent/Chart/RatingChart";

// Shared function to fetch bookings
const fetchBookings = async () => {
  const token = authToken();
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/books/sport-center`,
      { headers }
    );
    return response.data.bookings || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Failed to fetch bookings");
  }
};

function TotalCustomer() {
  const {
    data: totalUsers = 0,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["totalUsers"],
    queryFn: async () => {
      // Get the data from API
      const bookings = await fetchBookings();

      // The user could book multiple time and it will increase the users count
      // So we need to check the duplicate user either online or contact users
      const uniqueUsers = new Set(
        bookings.map((booking) => booking?.user?._id || booking?.outside_user)
      );

      // return the amount of total customer that booked in the sport center
      return uniqueUsers.size;
    },
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching data</p>;

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
        backgroundColor: "#2E8BC0",
        color: "#fff",
        borderRadius: "1rem",
      }}
      elevation={5}>
      <Typography
        display="flex"
        alignItems="center"
        component="div"
        variant="h5"
        sx={{ padding: "14px", fontWeight: "bold" }}>
        Total Customer
      </Typography>
      <div className="admin-totalCustomer">
        <AccountCircleIcon sx={{ fontSize: "2rem" }} />
        <Typography
          display="flex"
          alignItems="center"
          variant="h3"
          sx={{
            padding: "14px",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}>
          {totalUsers}
        </Typography>
      </div>
    </Paper>
  );
}

function MatchAcception() {
  const {
    data: totalBooking = 0,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["totalBooking"],
    queryFn: async () => {
      const bookings = await fetchBookings();

      // Filter only the approved bookings
      const totalApprovedBookings = bookings.filter(
        (booking) => booking.status === "approved"
      );
      return totalApprovedBookings.length;
    },
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching data</p>;

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
        backgroundColor: "#50C878",
        color: "#fff",
        borderRadius: "1rem",
      }}
      elevation={5}>
      <Typography
        display="flex"
        alignItems="center"
        component="div"
        variant="h5"
        sx={{ padding: "14px", fontWeight: "bold" }}>
        Match Acception
      </Typography>
      <div className="admin-totalAcception">
        <AccessAlarmsIcon sx={{ fontSize: "2rem" }} />
        <Typography
          display="flex"
          alignItems="center"
          variant="h3"
          sx={{
            padding: "14px",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}>
          {totalBooking}
        </Typography>
      </div>
    </Paper>
  );
}

//* List all the bookings in sport center
function TotalBooking() {
  const {
    data: totalBookings = 0,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["totalBookings"],
    queryFn: async () => {
      const bookings = await fetchBookings();
      return bookings.length;
    },
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching data</p>;

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
        backgroundColor: "#A98EC0",
        color: "#fff",
        borderRadius: "1rem",
      }}
      elevation={5}>
      <Typography
        display="flex"
        alignItems="center"
        component="div"
        variant="h5"
        sx={{ padding: "14px", fontWeight: "bold" }}>
        Total Booking
      </Typography>
      <div className="admin-totalBooking">
        <BookIcon sx={{ fontSize: "2rem" }} />
        <Typography
          display="flex"
          alignItems="center"
          variant="h3"
          sx={{
            padding: "14px",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}>
          {totalBookings}
        </Typography>
      </div>
    </Paper>
  );
}

// List all the information of users that have already booked
function CustomerTable() {
  const token = authToken();
  const [userName, setUserName] = useState("");

  const {
    data: customersPaticipant = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["totalUsers", token],
    queryFn: async () => {
      const bookings = await fetchBookings(token);
      const userMap = new Map();

      const customersPaticipant = bookings.reduce((acc, booking) => {
        // Loop to get either online or contact users
        const user = booking.user || booking.outside_user;
        if (!user) return acc;

        // Both online or contact has their own id and if the userMap have already had the user , only increase their amount of booking
        // else include the user and increase their booking
        const userId = user._id || booking.outside_user;
        if (userMap.has(userId)) {
          userMap.get(userId).count += 1;
        } else {
          userMap.set(userId, { ...user, count: 1 });
          acc.push({ ...user, count: 1 });
        }

        return acc;
      }, []);

      return customersPaticipant;
    },
  });

  // search by name and memorize the output (cached the information)
  const filteredUsers = useMemo(
    () =>
      userName
        ? customersPaticipant.filter((user) =>
            user.name.toLowerCase().includes(userName.toLowerCase())
          )
        : customersPaticipant,
    [userName, customersPaticipant]
  );

  if (isLoading) return <Loader />;
  if (error) return <p>Error fetching data</p>;

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
        marginTop: "1rem",
        borderRadius: "1rem",
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}>
        <Typography
          display="flex"
          alignItems="center"
          gutterBottom
          component="div"
          variant="h6"
          sx={{ padding: "14px", fontWeight: "bold" }}>
          Customer
        </Typography>
        <Box sx={{ maxWidth: "100%" }}>
          <TextField
            onChange={(e) => setUserName(e.target.value)}
            size="small"
            sx={{ width: "20rem" }}
            label="Search"
          />
        </Box>
      </div>
      <Divider />

      <TableContainer
        sx={{
          maxHeight: "20rem",
          overflow: "hidden",
          overflowY: "scroll",
          height: "15rem",
        }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Phone number</TableCell>
              <TableCell align="left">Amount Booking</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((row, i) => (
              <TableRow
                key={i}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  height: "2rem",
                }}>
                <TableCell align="left">
                  {row?.name || row?.outside_user}
                </TableCell>
                <TableCell align="left">{row?.email || "N/A"}</TableCell>
                <TableCell align="left">{row?.phone_number || "N/A"}</TableCell>
                <TableCell align="left">{row?.count || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function UpcomingMatch() {
  const {
    data: upcomingMatch = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["upcomingMatch"],
    queryFn: async () => {
      const bookings = await fetchBookings();

      // Filter the today match if the booking date is equal to today date, it is the today match
      const todayMatch = bookings.filter(
        (booking) =>
          formatDate(booking.date) === dayjs(new Date()).format("MMMM DD, YYYY")
      );
      return todayMatch;
    },
    refetchOnWindowFocus: true,
  });

  const showTodayMatch = useMemo(() => {
    if (!upcomingMatch) return null;
    return upcomingMatch.map((data, key) => (
      <TableRow key={key}>
        <TableCell align="left" style={{ minWidth: "100px" }}>
          {data?.user?.name || data?.outside_user?.name}
        </TableCell>
        <TableCell align="left">
          {data?.user?.phone_number || data?.outside_user?.phone_number}
        </TableCell>
        <TableCell align="left" style={{ minWidth: "100px" }}>
          {data.facility}
        </TableCell>
        <TableCell align="left" style={{ minWidth: "100px" }}>
          {data.court}
        </TableCell>
        <TableCell align="left" style={{ minWidth: "100px" }}>
          {totalHour(data.startTime, data.endTime)}
        </TableCell>
        <TableCell align="left" style={{ minWidth: "100px" }}>
          {formatDate(data.date)}
        </TableCell>
      </TableRow>
    ));
  }, [upcomingMatch]);

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
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}>
        <Typography
          display="flex"
          alignItems="center"
          gutterBottom
          component="div"
          variant="h6"
          sx={{ padding: "14px", fontWeight: "bold" }}>
          Upcoming Match
        </Typography>
      </div>
      <Divider />

      <TableContainer
        sx={{
          maxHeight: "20rem",
          overflow: "hidden",
          overflowY: "scroll",
          height: "15rem",
        }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left"> Name</TableCell>
              <TableCell align="left"> Phone number</TableCell>
              <TableCell align="left"> Facility</TableCell>
              <TableCell align="left"> Court</TableCell>
              <TableCell align="left"> Hour</TableCell>
              <TableCell align="left"> Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showTodayMatch.length > 0 ? (
              showTodayMatch
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={6}>
                  No Match for today
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

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
