import axios from "axios";
import GeoSpatial from "../../../components/map/GeoSpatial";
import useCurrentLessor from "../../../utils/useCurrentLessor";
import authToken from "./../../../utils/authToken";
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
import { useState } from "react";
import { notify, errorAlert } from "./../../../utils/toastAlert";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const setLocation = async (coordinates) => {
  const token = authToken();
  try {
    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}/location/update/coordinate`,
      coordinates,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data.message;
  } catch (err) {
    throw new Error(err);
  }
};
export default function Location() {
  const lessor = useCurrentLessor();
  const queryClient = useQueryClient();

  const [coordinatesData, setCoordinatesData] = useState({
    latitude: lessor?.location?.coordinates[1] || "",
    longitude: lessor?.location?.coordinates[0] || "",
  });

  // get the text field input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoordinatesData({ ...coordinatesData, [name]: value });
  };

  const updateLocation = useMutation({
    mutationFn: (updateData) => setLocation(updateData),
    onSuccess: () => {
      notify("Location update successfully");
      queryClient.invalidateQueries({ queryKey: ["location"] });
    },
    onError: () => {
      errorAlert("Update Error");
    },
  });

  // Handle submitting the coordinates of your current location
  const handleSubmitCoordinate = () => {
    const coordinates = {
      latitude: coordinatesData.latitude,
      longitude: coordinatesData.longitude,
    };

    updateLocation.mutate(coordinates);
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
            width: "75%",
          }}>
          <Typography
            sx={{
              fontSize: "1.5rem",
              textAlign: "center",
              fontWeight: "bold",
            }}>
            Your Currrent Location
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
              value={coordinatesData.latitude}
              variant="outlined"
              name="latitude"
              type="number"
            />
            <TextField
              value={coordinatesData.longitude}
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
        />
      </Box>
    </>
  );
}
