import "react-toastify/dist/ReactToastify.css";
import "ldrs/ring";
import authToken from "./../../../utils/authToken.jsx";
import { v4 } from "uuid";
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
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { notify } from "./../../../utils/toastAlert";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SettingsIcon from "@mui/icons-material/Settings";
import { storage } from "./../../../firebase/firebase"; // make sure you have firebase initialized
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ToastContainer } from "react-toastify";
import Loader from "../../../components/Loader.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { profileAPI } from "../../../api/admin/index";
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
  const token = authToken();
  const queryClient = useQueryClient();
  const [centerImage, setCenterImage] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [file, setFile] = useState(null);

  // Query the data from server
  const {
    data: currentLessor, // Variable that store all the lessor profile
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["currentLessor"],
    queryFn: () => profileAPI.fetchLessor(token),
    refetchOnWindowFocus: true, // update immediately without refreshing
  });

  // Store lessor data in state
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
    logo: currentLessor?.logo || "",
  });

  useEffect(() => {
    if (currentLessor) {
      setFormData({
        email: currentLessor.email,
        phoneNumber: currentLessor.phone_number,
        firstName: currentLessor.first_name,
        lastName: currentLessor.last_name,
        sportName: currentLessor.sportcenter_name,
        openTime: dayjs(currentLessor.operating_hours.open, "hh:mma"),
        closeTime: dayjs(currentLessor.operating_hours.close, "hh:mma"),
        street: currentLessor.address.street,
        state: currentLessor.address.state,
        city: currentLessor.address.city,
        description: currentLessor.sportcenter_description,
        logo: currentLessor.logo,
      });
    }
  }, [currentLessor]);

  // get the text field input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTimeChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Function to Immediate Update when update information successfully
  const updateLessorMutation = useMutation({
    mutationFn: (updatedData) => profileAPI.updateLessor(updatedData, token),
    onSuccess: () => {
      notify("Lessor updated successfully");
      queryClient.invalidateQueries({ queryKey: ["currentLessor"] });
    },
  });

  const handleEditLessor = async (e) => {
    e.preventDefault();

    let downloadURL = photoURL;

    if (centerImage) {
      const imageID = v4();
      const imageFormat = centerImage.type.split("/")[1];
      const imgRef = ref(storage, `lessor_image/${imageID}.${imageFormat}`);
      const uploadTask = uploadBytesResumable(imgRef, centerImage);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Error uploading image:", error);
            reject(error);
          },
          async () => {
            try {
              downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setPhotoURL(downloadURL);
              resolve();
            } catch (err) {
              console.error("Error getting download URL:", err);
              reject(err);
            }
          }
        );
      });
    }

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
        open: dayjs(formData.openTime).format("hh:mma"),
        close: dayjs(formData.closeTime).format("hh:mma"),
      },
      logo: downloadURL || formData.logo, // Add the photoURL to the credentials
    };

    updateLessorMutation.mutate(credentials);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCenterImage(file);
    setFile(URL.createObjectURL(file));
  };

  if (isLoading) return <Loader />;
  if (isError) return <p>Error loading lessor information</p>;

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
              src={file ? file : formData.logo}
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
                onChange={handleImageChange}
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
                sx={{
                  fontSize: ".8rem",
                  fontWeight: "bold",
                  color: "#444444",
                }}>
                Name :
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
                sx={{
                  fontSize: ".8rem",
                  fontWeight: "bold",
                  color: "#444444",
                }}>
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
                sx={{
                  fontSize: ".8rem",
                  fontWeight: "bold",
                  color: "#444444",
                }}>
                Phone Number :
              </Typography>
              <Typography
                sx={{ fontSize: ".8rem", fontWeight: 500, color: "#444444" }}>
                {currentLessor?.phone_number}
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
                sx={{
                  fontSize: ".8rem",
                  fontWeight: "bold",
                  color: "#444444",
                }}>
                Opening Time :
              </Typography>
              <Typography
                sx={{ fontSize: ".8rem", fontWeight: 500, color: "#444444" }}>
                {currentLessor?.operating_hours?.open} -
                {currentLessor?.operating_hours?.close}
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Opening Time"
                    value={dayjs(formData.openTime, "hh:mma")}
                    onChange={(newValue) =>
                      handleTimeChange("openTime", newValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Closing Time"
                    value={dayjs(formData.closeTime, "hh:mma")}
                    onChange={(newValue) =>
                      handleTimeChange("closeTime", newValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
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
    </>
  );
}
