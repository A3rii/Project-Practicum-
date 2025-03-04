import GeoSpatial from "../../../components/map/GeoSpatial";
import useCurrentLessor from "../../../utils/useCurrentLessor";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { notify, errorAlert } from "./../../../utils/toastAlert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { locationAPI } from "../../../api/admin";

export default function Location() {
  const lessor = useCurrentLessor();
  const queryClient = useQueryClient();

  // State for latitude and longitude
  const [coordinatesData, setCoordinatesData] = useState({
    latitude: lessor?.location?.coordinates[1] || "",
    longitude: lessor?.location?.coordinates[0] || "",
  });

  // Update state when text fields are changed
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setCoordinatesData({ ...coordinatesData, [name]: parseFloat(value) });
    },
    [coordinatesData]
  );

  // Mutation for updating location
  const updateLocation = useMutation({
    mutationFn: (updateData) => locationAPI.setLocation(updateData),
    onSuccess: () => {
      notify("Location updated successfully");
      queryClient.invalidateQueries({ queryKey: ["location"] });
    },
    onError: () => {
      errorAlert("Update Error");
    },
  });

  // Submit coordinates to the server
  const handleSubmitCoordinate = () => {
    const coordinates = {
      latitude: coordinatesData.latitude,
      longitude: coordinatesData.longitude,
    };

    updateLocation.mutate(coordinates);
  };

  // Update coordinates when a location is selected on the map
  const handleMapLocationChange = (lat, lng) => {
    setCoordinatesData({ latitude: lat, longitude: lng });
  };

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: {
            xs: "column",
            lg: "row",
          },
          gap: "3rem",
        }}>
        <Paper
          sx={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "1rem",
            gap: "1.5rem",
            width: { lg: "75%", xs: "100%" },
          }}>
          <Typography
            sx={{
              fontSize: "1.5rem",
              textAlign: "center",
              fontWeight: "bold",
            }}>
            Your Current Location
          </Typography>
          <Divider sx={{ width: "100%" }}>
            <Chip label="Address" size="small" />
          </Divider>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              alignItems: "center",
            }}>
            <Typography sx={{ fontSize: ".8rem" }}>
              {lessor?.address?.street}
            </Typography>
            <Typography sx={{ fontSize: ".8rem" }}>
              {lessor?.address?.state}
            </Typography>
            <Typography sx={{ fontSize: ".8rem" }}>
              {lessor?.address?.city}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: "1.5rem", marginTop: ".7rem" }}>
            <TextField
              label="Latitude"
              onChange={handleChange}
              value={coordinatesData.latitude || ""}
              variant="outlined"
              name="latitude"
              type="number"
            />
            <TextField
              value={coordinatesData.longitude || ""}
              onChange={handleChange}
              label="Longitude"
              name="longitude"
              variant="outlined"
              type="number"
            />
          </Box>
          <Button variant="contained" onClick={handleSubmitCoordinate}>
            Submit
          </Button>
        </Paper>
        <GeoSpatial
          latitude={coordinatesData.latitude}
          longitude={coordinatesData.longitude}
          name={lessor?.sportcenter_name || ""}
          onLocationChange={handleMapLocationChange} 
        />
      </Box>
    </>
  );
}
