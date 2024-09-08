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
  styled,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { v4 } from "uuid";
import Loader from "./../../../components/Loader";
import axios from "axios";
import {
  PhotoCamera as PhotoCameraIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import authToken from "../../../utils/authToken";
import { storage } from "./../../../firebase/firebase"; // make sure you have firebase initialized
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { notify, errorAlert } from "./../../../utils/toastAlert";



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

const headers = {
  Accept: "application/json",
  Authorization: `Bearer ${authToken()}`,
  "Content-Type": "application/json",
};

const moderatorProfile = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/moderator/profile`,
      { headers }
    );
    return data.moderator;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateModerator = async (updateInformation) => {
  try {
    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}/auth/moderator/update`,
      updateInformation,
      { headers }
    );
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export default function Profile() {
  const queryClient = useQueryClient();

  const [centerImage, setCenterImage] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [file, setFile] = useState(null);
  console.log(file);

  const {
    data: moderator,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["moderator"],
    queryFn: moderatorProfile,
    refetchOnWindowFocus: true,
  });

  const [formData, setFormData] = useState({
    name: moderator?.name || "",
    email: moderator?.email || "",
    phoneNumber: moderator?.phone_number || "",
    avatar: moderator?.avatar || "",
  });

  const updateModeratorProfile = useMutation({
    mutationFn: (updateData, token) => updateModerator(updateData, token),
    onSuccess: () => {
      notify("Update Successfully");
      queryClient.invalidateQueries({ queryKey: ["moderator"] });
    },
    onError: () => {
      errorAlert("Update Error");
    },
  });

  // get the text field input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCenterImage(file);
    setFile(URL.createObjectURL(file));
  };

  const handleUpdateModerator = async (e) => {
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

    const information = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phoneNumber,
      avatar: downloadURL || formData.avatar,
    };
    updateModeratorProfile.mutate(information);
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
              alt={moderator?.name}
              src={file ? file : formData.avatar}
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
                onChange={handleImageChange}
                id="upload-button"
                type="file"
              />
            </label>
          </Stack>

          <Typography
            sx={{ fontSize: ".8rem", fontWeight: 500, color: "#444444" }}>
            {moderator?.role}
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
                {moderator?.name}
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
                {moderator?.email}
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
                {moderator?.phone_number}
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ padding: "3rem", maxWidth: "100%" }}>
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
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  color="secondary"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  variant="outlined"
                  color="secondary"
                  onChange={handleChange}
                  value={formData.email}
                  type="email"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  variant="outlined"
                  onChange={handleChange}
                  value={formData.phoneNumber}
                  color="secondary"
                  type="text"
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
                onClick={handleUpdateModerator}
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
