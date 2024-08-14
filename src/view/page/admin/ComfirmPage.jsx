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
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { notify, errorAlert } from "./../../../utils/toastAlert";
import { formatDate, totalHour } from "./../../../utils/timeCalculation";
import Loader from "../../../components/Loader";
import "react-toastify/dist/ReactToastify.css";

//* Fetching all the bookings with limit data but only pending bookings
const fetchBookings = async (page) => {
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

  // Search for pending bookings
  const getPendingBookings = bookings.filter(
    (bookings) => bookings.status === "pending"
  );
  return getPendingBookings;
};

//* Checking for the expire bookings if expire reject all of those (in case situation)
const fetchAndProcessExpiredBookings = async () => {
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

  const currentDate = new Date(); //Get current date
  currentDate.setHours(0, 0, 0, 0); // set all the time to all 0

  const promises = bookings.map(async (booking) => {
    const bookingDate = new Date(booking.date);

    // Checking if the date is expire and the status is pending put them to rejected
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

//* Updating Status Approved or rejected
const updateBookingStatus = async ({ status, bookingId }) => {
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

export default function ConfirmPage() {
  const queryClient = useQueryClient();

  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const [pageTotal, setPageTotal] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Popover for filtering MUI components
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handlePageChange = (event, value) => {
    setPageTotal(value);
  };

  // Get Pending Booking from API
  const {
    data: pendingBookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings", pageTotal],
    queryFn: () => fetchBookings(pageTotal),
    keepPreviousData: true,
  });

  // Query for expired date
  const expiredBookingsQuery = useQuery({
    queryKey: ["expiredBookings"],
    queryFn: fetchAndProcessExpiredBookings,
    refetchOnWindowFocus: false,
  });

  // If the date of booking is expired refetch the api and the status of booking is rejected
  useEffect(() => {
    if (expiredBookingsQuery.data) {
      expiredBookingsQuery.refetch();
    }
  }, [expiredBookingsQuery]);

  // Update the status of user and update constantly
  const mutation = useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      notify("Booking status updated");
      queryClient.invalidateQueries("bookings");
      queryClient.invalidateQueries("expiredBookings");
    },
    onError: () => {
      errorAlert("Error updating booking status");
    },
  });

  //
  const handleAccept = (status, bookingId) => {
    mutation.mutate({ status, bookingId });
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  // Filter for today match
  const filteredBookings = pendingBookings?.filter((booking) => {
    if (selectedFilter === "today") {
      return formatDate(booking.date) === dayjs().format("MMMM DD, YYYY"); // Example: July 12, 2024
    }
    return true;
  });

  // Search By name or phone number
  const searchFilteredBookings = filteredBookings?.filter((booking) => {
    const user = booking.user || booking.outside_user; // have contact user and online user
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.phone_number.toLowerCase().includes(search.toLowerCase())
    );
  });

  const listBookings = searchFilteredBookings?.map((data, key) => (
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
  ));

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading lessor information</p>;

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
                  <TableCell align="center" colSpan={10}>
                    No Booking
                  </TableCell>
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
              count={pendingBookings?.totalPages || 1}
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
