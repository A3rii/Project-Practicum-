import { useState, useMemo } from "react";
import {
  Paper,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  TextField,
  Popover,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Pagination,
  PaginationItem,
  Stack,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { formatDate, totalHour } from "./../../../utils/timeCalculation";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import authToken from "./../../../utils/authToken";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Loader from "./../../../components/Loader";

// Api request for list of bookings
const fetchBookings = async (token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/books/sport-center`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.bookings;
};

export default function IncomingMatch() {
  const token = authToken();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);

  // Get the bookings data
  const {
    data: allBookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => fetchBookings(token),
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  // Filter the rejected bookings or approved bookings
  const filteredBookings = useMemo(() => {
    if (selectedFilter === "rejected") {
      return allBookings.filter((booking) => booking.status === "rejected");
    }
    return allBookings.filter((booking) => booking.status === "approved");
  }, [allBookings, selectedFilter]);

  // List all the bookings in data table
  const listBookings = useMemo(() => {
    if (!Array.isArray(filteredBookings) || filteredBookings.length === 0)
      return null;

    return filteredBookings.map((data, key) => (
      <TableRow key={key}>
        <TableCell align="left">
          {data?.user?.name || data?.outside_user?.name}
        </TableCell>
        <TableCell align="left">
          {data?.user?.phone_number || data?.outside_user?.phone_number}
        </TableCell>
        <TableCell align="center">{data.facility}</TableCell>
        <TableCell align="center">{data.court}</TableCell>
        <TableCell align="center">{formatDate(data.date)}</TableCell>
        <TableCell align="left">{data.startTime}</TableCell>
        <TableCell align="left">{data.endTime}</TableCell>
        <TableCell align="left">
          {totalHour(data.startTime, data.endTime)}
        </TableCell>
        <TableCell
          sx={{
            display: "inline-block",
            margin: "12px",
            padding: "5px 9px",
            fontSize: "12px",
            fontWeight: "bold",
            backgroundColor: data.status === "approved" ? "#00FF00" : "#FF0000",
            color: "white",
            borderRadius: "10px",
            textAlign: "center",
          }}>
          {data.status}
        </TableCell>
      </TableRow>
    ));
  }, [filteredBookings]);

  // If it is still fetching
  if (isLoading) return <Loader />;

  // If  fetching is error
  if (error) return <div>Error loading bookings</div>;

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        overflow: "hidden",
        padding: "15px",
        marginTop: "2rem",
        marginLeft: "2rem",
      }}
      elevation={10}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Typography
          display="flex"
          alignItems="center"
          gutterBottom
          variant="h5"
          component="div"
          sx={{ padding: "14px", fontWeight: "bold" }}>
          Match Acception
        </Typography>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            gap: "1rem",
          }}>
          <Box sx={{ maxWidth: "100%" }}>
            <TextField size="small" sx={{ width: "20rem" }} label="Search..." />
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
              onChange={handleFilterChange}
              sx={{
                width: "9rem",
                height: "9rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <RadioGroup name="radio-buttons-group">
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel
                  value="rejected"
                  control={<Radio />}
                  label="Rejected"
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
              <TableCell align="left">Phone Number</TableCell>
              <TableCell align="center">Facility</TableCell>
              <TableCell align="center">Court</TableCell>
              <TableCell align="center">Date </TableCell>
              <TableCell align="left">Start </TableCell>
              <TableCell align="left">End </TableCell>
              <TableCell align="left">Hour </TableCell>
              <TableCell align="left">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listBookings ? (
              listBookings
            ) : (
              <TableRow>
                <TableCell colSpan={8}>No Incoming match</TableCell>
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
            count={10}
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
  );
}
