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
  Pagination,
  PaginationItem,
} from "@mui/material";
import authToken from "./../../../utils/authToken";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import dayjs from "dayjs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { notify, errorAlert } from "./../../../utils/toastAlert";
import { formatDate, totalHour } from "./../../../utils/timeCalculation";
import "react-toastify/dist/ReactToastify.css";

export default function ConfirmPage() {
  const token = authToken();

  const [anchorEl, setAnchorEl] = useState(null);
  const [booking, setBooking] = useState([]);
  const [expiredBooking, setExpiredBooking] = useState([]);
  const [search, setSearch] = useState("");
  const [pageTotal, setTotalPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //* Filter Match By today's Date
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handlePageChange = (event, value) => {
    setTotalPage(value);
  };

  //* Fetch all the booking with limited data (pagination)
  const fetchBooking = useCallback(async () => {
    try {
      const getBooking = await axios.get(
        `${import.meta.env.VITE_API_URL}/books/customer/pagination`,
        {
          params: {
            page: pageTotal,
            limit: 4,
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { bookings, totalPages } = getBooking.data;
      setTotalPages(totalPages);
      setFilteredBookings(bookings); // Initialize with all bookings

      // Find Only pending status of users
      const approvedOrders = bookings.filter(
        (booking) => booking.status === "pending"
      );
      setBooking(approvedOrders);
    } catch (err) {
      console.log(err.message);
    }
  }, [token, pageTotal]);

  //* Incase the booking date is expired automatically rejected
  useEffect(() => {
    // Get all bookings from lessor
    const getAndProcessBookings = async () => {
      try {
        // Fetch bookings from the API
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

        const currentDate = new Date(); // Get the Today date
        currentDate.setHours(0, 0, 0, 0);

        // Process each booking to check if it's expired
        const promises = bookings.map(async (booking) => {
          const bookingDate = new Date(booking.date);

          // If the date is expired from today and the status is still pending
          if (bookingDate < currentDate && booking.status === "pending") {
            try {
              await axios.put(
                `${import.meta.env.VITE_API_URL}/books/${booking._id}/status`,
                {
                  status: "rejected",
                },
                {
                  headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            } catch (err) {
              console.log(
                `Failed to update booking ${booking._id}: ${err.message}`
              );
            }
          }
        });

        await Promise.all(promises);

        // Update state with the fetched bookings
        setExpiredBooking(bookings);
      } catch (err) {
        console.log(`Failed to fetch bookings: ${err.message}`);
      }
    };

    getAndProcessBookings();
  }, [token]);

  //*  Changing status of users
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
  }, [fetchBooking, pageTotal]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Checking For today match  in Radio filtering
  useEffect(() => {
    if (selectedFilter === "today") {
      // If the selection is today
      const todayMatch = booking.filter(
        (booking) =>
          formatDate(booking.date) === dayjs().format("MMMM DD, YYYY")
      );
      setFilteredBookings(todayMatch); // If we have a today match get the data
    } else {
      setFilteredBookings(booking); // Else fetch all the data
    }
  }, [selectedFilter, booking]);

  // Select filter in radio
  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  // Listing all bookings
  const listBookings = useMemo(() => {
    if (!filteredBookings) return null;

    const filterSearch = search
      ? filteredBookings.filter(
          (find) =>
            (find.user && // Search by name for online users booking
              find.user.name.toLowerCase().includes(search.toLowerCase())) ||
            (find.user &&
              find.user.phone_number // Search by phone number for online users booking
                .toLowerCase()
                .includes(search.toLowerCase())) ||
            (find.outside_user && // Search by name for contact users booking
              find.outside_user.name
                .toLowerCase()
                .includes(search.toLowerCase())) ||
            (find.outside_user && // Search by phone number  for contact users booking
              find.outside_user.phone_number
                .toLowerCase()
                .includes(search.toLowerCase()))
        )
      : filteredBookings;

    return (
      filterSearch && // Filter Search either  filteredBookings( name and phone filtter) or  filteredBookings
      filterSearch.map((data, key) => (
        <TableRow key={key}>
          <TableCell align="left">
            {data?.user?.name || data?.outside_user?.name}
          </TableCell>
          <TableCell align="center">
            {data?.user?.phone_number || data?.outside_user?.phone_number}
          </TableCell>
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
                Cancel
              </Button>
            </Stack>
          </TableCell>
        </TableRow>
      ))
    );
  }, [filteredBookings, handleAccept, search]);

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
            Confirmation Table
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
                <RadioGroup
                  value={selectedFilter}
                  onChange={handleFilterChange}
                  name="radio-buttons-group">
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label="All"
                  />
                  <FormControlLabel
                    value="today"
                    control={<Radio />}
                    label="Today"
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
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Start</TableCell>
                <TableCell align="center">End</TableCell>
                <TableCell align="center">Hour</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="center">Action</TableCell>
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
          <Stack
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
              padding: "1.5rem",
            }}>
            <Pagination
              count={totalPages}
              page={pageTotal}
              onChange={handlePageChange}
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                />
              )}
            />
          </Stack>
        </TableContainer>
      </Paper>
    </>
  );
}
