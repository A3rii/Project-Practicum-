import {
  Paper,
  Box,
  Avatar,
  Stack,
  Typography,
  IconButton,
  Divider,
  Chip,
  FormControl,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import useCurrentLessor from "./../../../utils/useCurrentLessor";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import { notify } from "./../../../utils/toastAlert";
import authToken from "../../../utils/authToken";

// Styling Input type of MUI component
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Profile() {
  // Global State
  const currentLessor = useCurrentLessor();
  const token = authToken();

  const [selectedFile, setSelectedFile] = useState(null);

  // Lessor account settings
  const [formData, setFormData] = useState({
    email: currentLessor?.email || "",
    phoneNumber: currentLessor?.phone_number || "",
    firstName: currentLessor?.first_name || "",
    lastName: currentLessor?.last_name || "",
    sportName: currentLessor?.sportcenter_name || "",
    openTime: currentLessor?.operating_hours?.open || "",
    closeTime: currentLessor?.operating_hours?.close || "",
    street: currentLessor?.address?.street || "",
    state: currentLessor?.address?.state || "",
    city: currentLessor?.address?.city || "",
    description: currentLessor?.sportcenter_description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditLessor = async (e) => {
    e.preventDefault();

    const credentials = {
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone_number: formData.phoneNumber,
      sportcenter_name: formData.sportName,
      sportcenter_description: formData.description,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
      },
      operating_hours: {
        open: formData.openTime,
        close: formData.closeTime,
      },
    };
    try {
      const editLessor = await axios.put(
        `${import.meta.env.VITE_API_URL}/lessor/update`,
        credentials,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(editLessor.data.message);
      notify(editLessor.data.message);
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "start",
        gap: "3rem",
      }}>
      {/* Lessor Information */}
      <Paper
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "3rem",
        }}>
        <Stack
          direction="column"
          sx={{
            padding: "2rem",
            alignItems: "end",
          }}>
          <Avatar
            alt={currentLessor?.sportcenter_name}
            src={currentLessor?.logo}
            sx={{ width: "12rem", height: "12rem" }}
          />
          <label htmlFor="upload-button">
            <IconButton
              aria-label="upload picture"
              component="span"
              size="large">
              <PhotoCameraIcon />
            </IconButton>
            <VisuallyHiddenInput
              id="upload-button"
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </label>
        </Stack>
        <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
          {currentLessor?.sportcenter_name}
        </Typography>
        <Typography
          sx={{ fontSize: ".8rem", fontWeight: 500, color: "#444444" }}>
          Sport center {currentLessor?.role}.
        </Typography>
        <Divider sx={{ width: "100%", marginY: "1rem" }}>
          <Chip label="Information" size="small" />
        </Divider>

        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            flexDirection: "column",
            gap: ".5rem",
          }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: ".5rem",
            }}>
            <Typography
              sx={{ fontSize: ".8rem", fontWeight: "bold", color: "#444444" }}>
              Owner :
            </Typography>
            <Typography
              sx={{ fontSize: ".8rem", fontWeight: 500, color: "#444444" }}>
              {currentLessor?.first_name} {currentLessor?.last_name}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: ".5rem",
            }}>
            <Typography
              sx={{ fontSize: ".8rem", fontWeight: "bold", color: "#444444" }}>
              Email :
            </Typography>
            <Typography
              sx={{ fontSize: ".8rem", fontWeight: 500, color: "#444444" }}>
              {currentLessor?.email}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: ".5rem",
            }}>
            <Typography
              sx={{ fontSize: ".8rem", fontWeight: "bold", color: "#444444" }}>
              Phone Number :
            </Typography>
            <Typography
              sx={{ fontSize: ".8rem", fontWeight: 500, color: "#444444" }}>
              {currentLessor?.phone_number}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ width: "100%", marginY: "1rem", marginTop: "2rem" }}>
          <Chip label="Sport Center Address" size="small" />
        </Divider>

        <Typography
          sx={{ fontSize: ".8rem", fontWeight: 500, color: "#444444" }}>
          {currentLessor?.address.street}, {currentLessor?.address.city},
          {currentLessor?.address.state}
        </Typography>
      </Paper>
      <Paper sx={{ padding: "3rem" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            gap: ".5rem",
          }}>
          <SettingsIcon />
          <Typography
            sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "#444444" }}>
            Account Settings
          </Typography>
        </Box>
        <Divider
          sx={{ width: "100%", marginTop: "1rem", marginBottom: "2rem" }}
        />

        <FormControl
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            flexDirection: "column",
            gap: "1rem",
          }}
          autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                color="secondary"
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                variant="outlined"
                color="secondary"
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Firstname"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
                color="secondary"
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lastname"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
                color="secondary"
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sport Center Name"
                name="sportName"
                value={formData.sportName}
                onChange={handleChange}
                variant="outlined"
                color="secondary"
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Open Time"
                name="openTime"
                value={formData.openTime}
                onChange={handleChange}
                variant="outlined"
                color="secondary"
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Close Time"
                name="closeTime"
                value={formData.closeTime}
                onChange={handleChange}
                variant="outlined"
                color="secondary"
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                variant="outlined"
                color="secondary"
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                variant="outlined"
                color="secondary"
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                variant="outlined"
                color="secondary"
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                label="Description"
                variant="outlined"
                type="text"
                color="secondary"
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              width: "100%",
            }}>
            <Button
              onClick={handleEditLessor}
              variant="contained"
              color="primary"
              type="submit">
              Update
            </Button>
          </Box>
        </FormControl>
      </Paper>
    </Box>
  );
}
