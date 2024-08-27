import { useMemo, useState } from "react";
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
  timeAvailability,
}) => {
  const { data: sportCenter = [], error } = useQuery({
    queryKey: [
      "sportCenter",
      name,
      selectedRatings,
      startTime,
      endTime,
      timeAvailability,
    ],
    queryFn: async () => {
      const getSportCenter = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessor/filter`,
        {
          params: {
            name: name || null,
            rating: selectedRatings,
            startTime: startTime || null,
            endTime: endTime || null,
            timeAvailability: timeAvailability,
          },
        }
      );

      return getSportCenter.data.lessors;
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
            width: { lg: 240, md: 210, xs: 200 },
            height: 380,
            marginBottom: "2rem",
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
            <Typography variant="h6" component="div" sx={{ fontSize: "1rem" }}>
              {data?.sportcenter_name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: "3px", fontSize: "0.7rem" }}>
              {data?.address?.street},{data?.address?.city},
              {data?.address?.state}
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
                  fontSize: "0.6rem", // Smaller font size for text
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
                sx={{ fontSize: "1.2rem" }}
                value={data?.overallRating}
                precision={0.5}
                readOnly
              />
              <Tooltip title={`User Rating ${data?.ratings.length}`}>
                <Typography
                  sx={{
                    fontWeight: "light",
                    fontSize: ".8rem",
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
            sx={{ marginLeft: "1rem" }}
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
  const handleInputChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleOnReset = () => {
    setData({
      sportCenterName: "",
      selectedRatings: [],
      startTime: null,
      endTime: null,
      timeAvailability: true,
    });
  };
  return (
    <Paper
      sx={{
        width: "23%",
        height: "100%",
        padding: "2rem",
        margin: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
        borderRadius: "1rem",
        gap: "2rem",
      }}
      elevation={3}>
      {/* Search bar */}

      <Paper
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search"
          inputProps={{ "aria-label": "search" }}
          value={data.sportCenterName}
          onChange={(e) => handleInputChange("sportCenterName", e.target.value)}
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <Button onClick={handleOnReset} color="error">
          Reset Filter
        </Button>
      </Paper>

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
          <Box sx={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <TimePicker
              label="From"
              value={dayjs(data.startTime).format("hh:mma")}
              onChange={(newValue) =>
                handleInputChange("startTime", dayjs(newValue).format("hh:mma"))
              }
              sx={{ width: 140 }} // Adjust the width here
            />
            <TimePicker
              label="To"
              value={dayjs(data.endTime).format("hh:mma")}
              onChange={(newValue) =>
                handleInputChange("endTime", dayjs(newValue).format("hh:mma"))
              }
              sx={{ width: 140 }} // Adjust the width here
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
          gap: "4rem",
        }}>
        <SportFieldCard
          name={data.sportCenterName}
          selectedRatings={data.selectedRatings}
          startTime={data.startTime}
          endTime={data.endTime}
          timeAvailability={data.timeAvailability}
        />
      </Box>
    </Box>
  );
}
