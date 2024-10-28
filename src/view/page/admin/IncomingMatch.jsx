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
  Popover,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import useCurrentLessor from "./../../../utils/useCurrentLessor";
import { useQuery } from "@tanstack/react-query";
import { formatDate, totalHour } from "./../../../utils/timeCalculation";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import authToken from "./../../../utils/authToken";
import axios from "axios";
import Loader from "./../../../components/Loader";

// Api request for list of bookings
const fetchBookings = async (token) => {
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
    return response.data.bookings || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return []; // Return an empty array if there's an error
  }
};

// Fetching sport center information
const fetchSportCenter = async (sportCenterId) => {
  try {
    const { data } = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/lessor/auth/informations/${sportCenterId}`
    );
    return data.lessor.facilities;
  } catch (err) {
    console.error("Error fetching sport center:", err.message);
    throw err;
  }
};

// Fetch court by the facility
const fetchCourt = async (facilityId) => {
  const token = authToken();
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/lessor/facility/${facilityId}/courts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.facility.courts;
};

export default function IncomingMatch() {
  const token = authToken();
  const lessor = useCurrentLessor();
  const [facility, setFacility] = useState("");
  const [court, setCourt] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("approved");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChangeFacility = (event) => {
    setFacility(event.target.value);
  };
  const handleChangeCourt = (event) => {
    setCourt(event.target.value);
  };

  // Fetch facilities
  const { data: facilities = [] } = useQuery({
    queryKey: ["facilities", lessor?._id],
    queryFn: () => fetchSportCenter(lessor?._id),
    keepPreviousData: true,
  });

  // Fetch all bookings
  const {
    data: allBookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allBookings"],
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

  // Fetching court details
  const { data: courts = [] } = useQuery({
    queryKey: ["court", facility],
    queryFn: () => {
      const selectedFacility = facilities.find((fac) => fac.name === facility);
      return selectedFacility ? fetchCourt(selectedFacility._id) : [];
    },
    enabled: !!facility,
  });

  // Filter bookings by facility and status (approved/rejected)
  const filteredBookings = useMemo(() => {
    return allBookings.filter((booking) => {
      const matchesFacility = facility ? booking.facility === facility : true;
      const matchesCourt = court ? booking.court === court : true;
      const matchesStatus = booking.status === selectedFilter;
      return matchesCourt && matchesFacility && matchesStatus;
    });
  }, [allBookings, facility, selectedFilter, court]);

  // Generate the list of bookings
  const listBookings = useMemo(() => {
    if (filteredBookings.length === 0) {
      return (
        <TableRow>
          <TableCell align="center" colSpan={9}>
            No matches found
          </TableCell>
        </TableRow>
      );
    }

    return filteredBookings.map((data, key) => (
      <TableRow key={key}>
        <TableCell align="left">
          {data?.user?.name || data?.outside_user?.name || "N/A"}
        </TableCell>
        <TableCell align="left">
          {data?.user?.phone_number ||
            data?.outside_user?.phone_number ||
            "N/A"}
        </TableCell>
        <TableCell align="center">{data.facility || "N/A"}</TableCell>
        <TableCell align="center">{data.court || "N/A"}</TableCell>
        <TableCell align="center">{formatDate(data.date) || "N/A"}</TableCell>
        <TableCell align="center">
          {data.startTime || "N/A"} - {data.endTime || "N/A"}
        </TableCell>
        <TableCell align="left">
          {totalHour(data.startTime, data.endTime) || "N/A"}
        </TableCell>
        <TableCell align="center">
          <Chip
            label={data.status}
            color={data.status === "approved" ? "success" : "error"}
            size="small"
            variant="outlined"
          />
        </TableCell>
      </TableRow>
    ));
  }, [filteredBookings]);

  // If it is still fetching data
  if (isLoading) return <Loader />;

  // If there was an error while fetching data
  if (error) return <div>Error loading bookings</div>;

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        overflow: "hidden",
        padding: "15px",
        marginLeft: "2rem",
        border: 0,
        borderTop: 0,
        borderRadius: 0,
      }}
      elevation={0}>
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
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Facility</InputLabel>
            <Select
              label="facility"
              value={facility}
              onChange={handleChangeFacility}>
              <MenuItem value="">All</MenuItem>
              {facilities.map((facility, key) => (
                <MenuItem value={facility.name} key={key}>
                  {facility.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Court</InputLabel>
            <Select label="court" value={court} onChange={handleChangeCourt}>
              <MenuItem value="">All</MenuItem>
              {courts.map((court, key) => (
                <MenuItem value={court.name} key={key}>
                  {court.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
              <RadioGroup name="radio-buttons-group" value={selectedFilter}>
                <FormControlLabel
                  value="approved"
                  control={<Radio />}
                  label="Accepted"
                />
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
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Time</TableCell>
              <TableCell align="left">Hour</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{listBookings}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
