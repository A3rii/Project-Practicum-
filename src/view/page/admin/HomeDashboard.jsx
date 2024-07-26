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
import { useState, useEffect, useMemo } from "react";
import { formatDate, totalHour } from "./../../../utils/timeCalculation";
import axios from "axios";
import authToken from "../../../utils/authToken";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import BookIcon from "@mui/icons-material/Book";
import dayjs from "dayjs";
import Loader from "./../../../components/Loader";
import { useQuery } from "@tanstack/react-query";

function TotalCustomer() {
  const token = authToken();

  const {
    data: totalUsers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["totalUsers"],
    queryFn: async () => {
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
      // Map all the booking either online and contact booking in a set (no duplicates)
      const uniqueUsers = new Set(
        bookings.map((booking) => booking?.user?._id || booking?.outside_user)
      );

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
  const token = authToken();

  const {
    data: totalBooking,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["totalBooking"],
    queryFn: async () => {
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

      const totalUsers = bookings.filter(
        (booking) => booking.status === "approved"
      );
      return totalUsers.length;
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
          {totalBooking ? totalBooking : 0}
        </Typography>
      </div>
    </Paper>
  );
}

function TotalBooking() {
  const token = authToken();

  const {
    data: totalBookings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["totalBookings"],
    queryFn: async () => {
      const booking = await axios.get(
        `${import.meta.env.VITE_API_URL}/books/sport-center`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const bookings = booking.data.bookings;
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
          {totalBookings ? totalBookings : 0}
        </Typography>
      </div>
    </Paper>
  );
}

function CustomerTable() {
  const token = authToken();
  const [userName, setUserName] = useState("");
  const [totalUsers, setTotalUsers] = useState([]);

  useEffect(() => {
    const fetchBooking = async () => {
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

        const { bookings } = response.data;

        // Create a map to count bookings for each user (including outside_user)
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

        setTotalUsers(uniqueUsersArray);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchBooking();
  }, [token]);

  //* Search by Name
  const filteredUsers = userName
    ? totalUsers.filter((user) =>
        user.name.toLowerCase().includes(userName.toLowerCase())
      )
    : totalUsers;

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
        marginTop: "1rem",
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
              <TableCell align="left"> Name</TableCell>
              <TableCell align="left"> Email </TableCell>
              <TableCell align="left"> Phone number</TableCell>
              <TableCell align="left"> Amount Booking</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell align="left" style={{ minWidth: "100px" }}>
                    {user?.name}
                  </TableCell>
                  <TableCell>{user?.email || "Called Customer"}</TableCell>
                  <TableCell>{user?.phone_number || "N/A"}</TableCell>
                  <TableCell align="left">{user.count}</TableCell>
                </TableRow>
              ))
            ) : (
              <Typography
                display="flex"
                justifyContent="start"
                alignItems="center"
                variant="h6"
                sx={{ padding: "14px" }}>
                No match for today
              </Typography>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
// Display match for today
function UpcomingMatch() {
  const token = authToken();
  const [match, setMatch] = useState([]);

  // Checking if the user is playing today
  useEffect(() => {
    const fetchBooking = async () => {
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
        const bookings = response.data.bookings;
        const todayMatch = bookings.filter(
          (booking) =>
            formatDate(booking.date) ===
            dayjs(new Date()).format("MMMM DD, YYYY")
        );

        setMatch(todayMatch);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchBooking();
  }, [token]);

  const showTodayMatch = useMemo(() => {
    if (!match) return null;
    return match.map((data, key) => (
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
  }, [match]);

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
        marginTop: "1rem",
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
          Today Match
        </Typography>
        <Box sx={{ maxWidth: "100%" }}>
          <TextField size="small" sx={{ width: "20rem" }} label="Search" />
        </Box>
      </div>
      <Divider />

      <TableContainer style={{ maxHeight: "20rem" }}>
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
              <Typography
                display="flex"
                justifyContent="start"
                alignItems="center"
                variant="h6"
                sx={{ padding: "14px", fontWeight: "bold" }}>
                No match for today
              </Typography>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default function HomeDash() {
  return (
    <>
      <Box sx={{ flexGrow: 1, marginTop: "2rem" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} xl={4} lg={4} sm={4}>
            <TotalCustomer />
          </Grid>

          <Grid item xs={12} xl={4} lg={4} sm={4}>
            <MatchAcception />
          </Grid>

          <Grid item xl={4} lg={4} sm={4} xs={12}>
            <TotalBooking />
          </Grid>

          {/*Customer Recent books*/}
          <Grid item xl={6} lg={12} sm={12}>
            <CustomerTable />
          </Grid>
          <Grid item xl={6} lg={12} sm={12}>
            <UpcomingMatch />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
