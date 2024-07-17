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
  Avatar,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import authToken from "./../../../utils/authToken";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Stack from "@mui/material/Stack";
import BookIcon from "@mui/icons-material/Book";
import boy from "./../../../assets/BookingImags/boy.jpg";

function TotalCustomer() {
  const token = authToken();
  const [totalUsers, setTotalUsers] = useState(0);

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

        const uniqueUsers = new Set(
          bookings.map((booking) => booking.user._id)
        );

        setTotalUsers(uniqueUsers.size);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchBooking();
  }, [token]);

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
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
  const [totalBooking, setTotalBooking] = useState([]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
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

        const totalUsers = bookings.filter(
          (booking) => booking.status === "approved"
        );
        setTotalBooking(totalUsers.length);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchBooking();
  }, [token]);

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
      }}
      elevation={5}>
      <Typography
        display="flex"
        alignItems="center"
        component="div"
        variant="h5"
        sx={{ padding: "14px", fontWeight: "bold" }}>
        Total Acception
      </Typography>
      <div className="admin-totalAcception">
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
  const [totalBooking, setTotalBooking] = useState([]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
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

        setTotalBooking(bookings.length);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchBooking();
  }, [token]);
  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
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
          {totalBooking ? totalBooking : 0}
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

        const bookings = response.data.bookings;

        // Create a map to count bookings for each user
        const userBookingCounts = {};
        bookings.forEach((booking) => {
          const userId = booking.user._id;
          if (!userBookingCounts[userId]) {
            userBookingCounts[userId] = {
              count: 1,
              user: booking.user,
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
    ? totalUsers.filter(
        (user) => user.name.toLowerCase() === userName.toLowerCase()
      )
    : totalUsers;

  console.log(totalUsers);
  return (
    <Paper
      sx={{
        maxWidth: "100%",
        overflow: "hidden",
        padding: "15px",
        marginTop: "1rem",
      }}
      elevation={5}>
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

      <TableContainer style={{ maxHeight: "20rem" }}>
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
            {filteredUsers &&
              filteredUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell align="left" style={{ minWidth: "100px" }}>
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number}</TableCell>
                  <TableCell align="left">{user.count}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default function HomeDash() {
  return (
    <>
      {/* Admin's profile */}

      <div className="home-mainProfile">
        <div className="home-profile">
          <Stack className="home-stack">
            <Avatar alt="K" src={boy} sx={{ width: 200, height: 200 }} />
          </Stack>

          <div className="home-profilePicture">
            <label htmlFor="home-addPicture" className="home-addPictureLabel">
              <AddAPhotoIcon
                style={{ fontSize: "25px", marginRight: "20px" }}
              />
            </label>
            <input
              type="file"
              id="home-addPicture"
              name="home-addPicture"
              accept="image/*"
              className="home-addPicture"
            />
          </div>
        </div>

        <div className="home-profileName">
          <span> Welcome Sport Center </span>
        </div>
      </div>

      <Box sx={{ flexGrow: 1, marginTop: "5rem" }}>
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
          <Grid item xl={12} lg={12} sm={12}>
            <CustomerTable />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
