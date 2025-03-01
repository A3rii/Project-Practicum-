import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import NoData from "../../../components/User/NoData";
import dayjs from "dayjs";
import axios from "axios";
import {
  Box,
  Rating,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Tooltip,
  Paper,
  Divider,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link, Navigate } from "react-router-dom";

const SportFieldCard = ({
  name,
  selectedRatings,
  startTime,
  endTime,
  latitude,
  longitude,
  timeAvailability,
}) => {
  const { data: sportCenter = [], error } = useQuery({
    queryKey: [
      "sportCenter",
      name,
      selectedRatings,
      startTime,
      endTime,
      latitude,
      longitude,
      timeAvailability,
    ],
    queryFn: async () => {
      const getSportCenter = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessor/filter`,
        {
          params: {
            name: name || null,
            rating: selectedRatings || [],
            startTime: startTime || null,
            endTime: endTime || null,
            timeAvailability: timeAvailability,
            latitude: latitude || null,
            longitude: longitude || null,
          },
        }
      );
      const sportCenters = getSportCenter.data.lessors;
      const checkingFacility = sportCenters.filter((lessor) => {
        // Check if facilities exist and is an array with elements
        if (Array.isArray(lessor.facilities) && lessor.facilities.length > 0) {
          // Check if any facility has a court property that is a non-empty array
          return lessor.facilities.some(
            (facility) =>
              Array.isArray(facility.court) && facility.court.length > 0
          );
        }
        return null;
      });
      return checkingFacility;
    },
  });

  const listSportCenter = useMemo(() => {
    if (!sportCenter || sportCenter.length === 0) return <NoData />;

    return (
      sportCenter.length > 0 &&
      sportCenter.map((data, key) => (
        <Card
          key={key}
          sx={{
            width: { lg: 240, md: 220, xs: 200 },
            height: { lg: 380, xs: 360 },
            marginBottom: "1rem",
          }}
          elevation={4}>
          <CardMedia sx={{ height: 190 }} loading="lazy" image={data?.logo} />

          <CardContent
            sx={{
              padding: "1rem",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: ".2rem",
            }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontSize: { lg: 15, sm: 10, xs: 10 } }}>
              {data?.sportcenter_name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: "3px", fontSize: { lg: 12, sm: 9, xs: 9 } }}>
              {data?.address?.street},{data?.address?.state},
              {data?.address?.city}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: "3px", fontSize: "0.7rem" }}>
              {data?.operating_hours?.open} - {data?.operating_hours?.close}
            </Typography>

            <Box
              sx={{
                display: "inline-block",
                width: "25%",
                padding: "2px 2px",
                fontSize: "10px",
                fontWeight: "bold",
                backgroundColor: timeAvailability ? "#7CFC00" : "#cccccc",
                borderRadius: "8px",
                textAlign: "center",
              }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { lg: 10, sm: 8, xs: 8 },
                  color: "#fff",
                  fontWeight: "bold",
                }}>
                {data?.time_availability ? "Open" : "Closed"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: ".6rem",
              }}>
              <Rating
                sx={{ fontSize: { lg: 19, sm: 15, xs: 12 } }}
                value={data?.overallRating}
                precision={0.5}
                readOnly
              />
              <Tooltip title={`User Rating ${data?.ratings.length}`}>
                <Typography
                  sx={{
                    fontWeight: "light",
                    fontSize: { lg: 12, sm: 10, xs: 10 },
                    color: "#595959",
                  }}>
                  ({data?.ratings.length})
                </Typography>
              </Tooltip>
            </Box>
          </CardContent>

          <Button
            component={Link}
            to={`/sportcenter/${data?._id}`}
            size="small"
            disabled={!timeAvailability}
            sx={{
              marginLeft: "1rem",
              "&:hover": {
                color: "#fff",
              },
            }}
            variant="contained"
            color="error">
            Book Now
          </Button>
        </Card>
      ))
    );
  }, [sportCenter, timeAvailability]);

  if (error) return <Navigate to="/error" />;
  return <>{listSportCenter} </>;
};

const FilterSideBar = ({ data, setData }) => {
  const [nearestLocation, setNearestLocation] = useState(false);

  const handleInputChange = useCallback(
    (key, value) => {
      setData((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setData]
  );
  const handleNearestLocationChange = (checked) => {
    setNearestLocation(checked);

    if (checked && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Update the state with latitude and longitude
          handleInputChange("latitude", latitude);
          handleInputChange("longitude", longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      // Reset latitude and longitude if unchecked
      handleInputChange("latitude", null);
      handleInputChange("longitude", null);
    }
  };

  const handleOnReset = () => {
    setData({
      sportCenterName: "",
      selectedRatings: [],
      startTime: null,
      endTime: null,
      latitude: null,
      longitude: null,
      timeAvailability: true,
    });
    setNearestLocation(false);
  };
  return (
    <Paper
      sx={{
        width: { xs: "90%", sm: "80%", md: "50%", lg: "25%" },
        maxWidth: "100%",
        height: "100%",
        padding: { xs: "1rem", sm: "1.5rem", md: "2rem" },
        margin: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
        borderRadius: "1rem",
        gap: "1rem",
      }}
      elevation={3}>
      {/* Search bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}>
        <Paper
          sx={{
            width: { xs: "100%", sm: "75%" }, // Adjust width on smaller screens
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            inputProps={{ "aria-label": "search" }}
            value={data.sportCenterName}
            onChange={(e) =>
              handleInputChange("sportCenterName", e.target.value)
            }
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>

        <Button
          onClick={handleOnReset}
          color="error"
          sx={{ display: { xs: "none", sm: "block" } }} // Hide Reset button on smaller screens
        >
          Reset
        </Button>
      </Box>

      {/* Nearest location */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          flexDirection: "column",
          gap: ".5rem",
          marginTop: "1rem",
        }}>
        <Typography variant="h5" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
          Closest Distance
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={nearestLocation}
              size="small"
              sx={{
                "& + .MuiFormControlLabel-label": {
                  fontSize: ".9rem",
                },
              }}
              onChange={(e) => handleNearestLocationChange(e.target.checked)}
            />
          }
          label="Nearest Location"
        />
      </Box>

      <Divider
        sx={{
          width: "100%",
        }}
      />

      {/* Rating */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          flexDirection: "column",
          gap: "1rem",
        }}>
        <Typography variant="h5" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
          Rating
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "start",
            gap: ".6rem",
          }}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: ".6rem",
              }}
              key={rating}>
              <Checkbox
                size="small"
                sx={{ width: 16, height: 16 }}
                checked={data.selectedRatings.includes(rating)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setData((prev) => ({
                      ...prev,
                      selectedRatings: [...prev.selectedRatings, rating],
                    }));
                  } else {
                    setData((prev) => ({
                      ...prev,
                      selectedRatings: prev.selectedRatings.filter(
                        (r) => r !== rating
                      ),
                    }));
                  }
                }}
              />
              <Rating key={rating} name="read-only" value={rating} readOnly />
              <Box sx={{ ml: 2 }}>({rating})</Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider
        sx={{
          width: "100%",
        }}
      />

      {/* Time availability */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          width: "100%",
        }}>
        <Typography variant="h5" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
          Opening Time
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: "flex",
              gap: { xs: ".5rem", sm: "1rem" }, // Responsive gap
              marginTop: "1rem",
              flexDirection: { xs: "column", sm: "row" }, // Stack time pickers on smaller screens
              width: "100%",
            }}>
            <TimePicker
              label="From"
              value={
                data.startTime ? dayjs(data.startTime).format("hh:mma") : null
              }
              onChange={(newValue) =>
                handleInputChange("startTime", dayjs(newValue).format("hh:mma"))
              }
              sx={{ width: "100%" }}
            />
            <TimePicker
              label="To"
              value={data.endTime ? dayjs(data.endTime).format("hh:mma") : null}
              onChange={(newValue) =>
                handleInputChange("endTime", dayjs(newValue).format("hh:mma"))
              }
              sx={{ width: "100%" }}
            />
          </Box>
        </LocalizationProvider>
      </Box>

      <Divider
        sx={{
          borderBottomWidth: 1,
          width: "100%",
        }}
      />

      {/* Time Availability */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          flexDirection: "column",
        }}>
        <Typography variant="h5" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
          Time Availability
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={data.timeAvailability}
              onChange={(e) =>
                handleInputChange("timeAvailability", e.target.checked)
              }
            />
          }
          label="Open"
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={!data.timeAvailability}
              onChange={(e) =>
                handleInputChange("timeAvailability", !e.target.checked)
              }
            />
          }
          label="Close"
        />
      </Box>
    </Paper>
  );
};

export default function Booking() {
  const [data, setData] = useState({
    sportCenterName: "",
    selectedRatings: [],
    startTime: null,
    latitude: null,
    longitude: null,
    endTime: null,
    timeAvailability: true,
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "start",
      }}>
      <FilterSideBar data={data} setData={setData} />
      <Box
        sx={{
          margin: "2rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "start",
          alignItems: "center",
          gap: "2rem",
        }}>
        <SportFieldCard
          name={data.sportCenterName}
          selectedRatings={data.selectedRatings}
          startTime={data.startTime}
          endTime={data.endTime}
          latitude={data.latitude}
          longitude={data.longitude}
          timeAvailability={data.timeAvailability}
        />
      </Box>
    </Box>
  );
}
