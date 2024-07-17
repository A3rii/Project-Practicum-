import {
  Paper,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Button,
  TableRow,
  TableCell,
  TextField,
  Box,
  Stack,
  Popover,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { useState, useEffect, useCallback, useMemo } from "react";
import authToken from "./../../../utils/authToken";
import axios from "axios";
import dayjs from "dayjs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ToastContainer } from "react-toastify";
import { notify, errorAlert } from "./../../../utils/toastAlert"; // Adjust the path as needed
import "react-toastify/dist/ReactToastify.css";

export default function ConfirmPage() {
  const token = authToken();

  const [anchorEl, setAnchorEl] = useState(null);
  const [booking, setBooking] = useState([]);
  const [search, setSearch] = useState("");

  const fetchBooking = useCallback(async () => {
    try {
      const getBooking = await axios.get(
        `${import.meta.env.VITE_API_URL}/books/sport-center`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const books = getBooking.data.bookings;

      const approvedOrders = books.filter(
        (booking) => booking.status === "pending"
      );
      setBooking(approvedOrders);
    } catch (err) {
      console.log(err.message);
    }
  }, [token]);

  const handleAccept = useCallback(
    async (status, bookingId) => {
      const changeStatus = {
        status: status === "approved" ? "approved" : "rejected",
      };

      try {
        const acceptBooking = await axios.put(
          `${import.meta.env.VITE_API_URL}/books/${bookingId}/status`,
          changeStatus,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Booking status updated:", acceptBooking.data);
        notify(`This user has been ${status}`);
        fetchBooking();
      } catch (err) {
        errorAlert("Error Accepting");
        console.log("Error updating booking status:", err.message);
      }
    },
    [token, fetchBooking]
  );

  useEffect(() => {
    fetchBooking();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Formatting date
  const formatDate = (date) => {
    return dayjs(date).format("MMMM DD, YYYY");
  };

  // Calculate the total hours
  const totalHour = (start, end) => {
    return parseInt(end) - parseInt(start);
  };

  const listBookings = useMemo(() => {
    if (!booking) return null;
    const filterSearch = search
      ? booking.filter(
          (find) =>
            (find.user &&
              find.user.name.toLowerCase().includes(search.toLowerCase())) ||
            (find.user &&
              find.user.phone_number
                .toLowerCase()
                .includes(search.toLowerCase()))
        )
      : booking;

    return (
      filterSearch &&
      filterSearch.map((data, key) => (
        <TableRow key={key}>
          <TableCell align="left">{data.user?.name || data.user}</TableCell>
          {/* <TableCell align="center">{data.user.phone_number}</TableCell> */}
          <TableCell align="center">{data.facility}</TableCell>
          <TableCell align="center">{data.court}</TableCell>
          <TableCell align="center">{formatDate(data.date)}</TableCell>
          <TableCell align="center">{data.startTime}</TableCell>
          <TableCell align="center">{data.endTime}</TableCell>
          <TableCell align="center">
            {totalHour(data.startTime, data.endTime)}
          </TableCell>
          <TableCell
            sx={{
              display: "inline-block",
              marginTop: "1.2rem",
              padding: "5px 10px",
              fontSize: "12px",
              fontWeight: "bold",
              backgroundColor: "orange",
              color: "white",
              borderRadius: "10px",
              textAlign: "center",
            }}>
            {data.status}
          </TableCell>
          <TableCell align="center">
            <Stack direction="row" spacing={1}>
              <Button
                onClick={() => handleAccept("approved", data._id)}
                variant="outlined"
                color="success">
                Accept
              </Button>
              <Button
                onClick={() => handleAccept("rejected", data._id)}
                variant="outlined"
                color="error">
                Deny
              </Button>
            </Stack>
          </TableCell>
        </TableRow>
      ))
    );
  }, [booking, handleAccept, search]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Paper
        sx={{
          maxWidth: "100%",
          overflow: "hidden",
          padding: "15px",
          marginTop: "2rem",
          marginLeft: "2rem",
        }}
        elevation={15}>
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
            variant="h5"
            component="div"
            sx={{ padding: "14px", fontWeight: "bold" }}>
            Customer
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              gap: "1rem",
            }}>
            <Box sx={{ maxWidth: "100%" }}>
              <TextField
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                sx={{ width: "20rem" }}
                label="Search"
              />
            </Box>
            <FilterAltIcon
              aria-describedby={id}
              variant="contained"
              onClick={handleClick}
              style={{
                fontSize: "2rem",
                marginRight: "20px",
                cursor: "pointer",
              }}
            />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}>
              <FormControl
                sx={{
                  width: "10rem",
                  height: "10rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <RadioGroup name="radio-buttons-group">
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="All"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Today"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Sport Type"
                  />
                </RadioGroup>
              </FormControl>
            </Popover>
          </div>
        </div>

        <Divider />
        <TableContainer style={{ height: "100%" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell sx={{ fontStyle: "bold" }} align="center">
                  Phone Number
                </TableCell>
                <TableCell align="center">Facility</TableCell>
                <TableCell align="center">Court</TableCell>
                <TableCell align="center">Date </TableCell>
                <TableCell align="center">Start </TableCell>
                <TableCell align="center">End</TableCell>
                <TableCell align="left">Hour </TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="center">Action </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listBookings.length > 0 ? (
                listBookings
              ) : (
                <TableRow>
                  <TableCell colSpan={10}>No Booking</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
