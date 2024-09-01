import {
  TextField,
  Button,
  Box,
  FormControl,
  Grid,
  Checkbox,
  Typography,
  FormControlLabel,
  styled,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerLessor } from "./../../../../app/slice.js";
import { notify, errorAlert } from "./../../../../utils/toastAlert.jsx";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { storage } from "./../../../../firebase/firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "react-toastify/dist/ReactToastify.css";

// Input file property
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

export default function SignUpLessor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Image handling
  const [centerImage, setCenterImage] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [file, setFile] = useState(null);
  const metadata = {
    contentType: "image/*",
  };

  // Lessor credential
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [sportName, setSportName] = useState("");
  const [openTime, setOpenTime] = useState(null);
  const [closeTime, setCloseTime] = useState(null);
  const [street, setStreet] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Form Validation
  const isFormValid = () => {
    return (
      firstName &&
      lastName &&
      email &&
      sportName &&
      openTime &&
      closeTime &&
      street &&
      state &&
      city &&
      phoneNumber &&
      password &&
      confirmPassword &&
      password === confirmPassword &&
      termsAccepted
    );
  };

  // File upload handling to firebase
  const uploadImage = async () => {
    if (!centerImage) return null;

    try {
      const imageID = v4();
      const imageFormat = centerImage.type.split("/")[1];
      const imgRef = ref(storage, `lessor_image/${imageID}.${imageFormat}`);
      const uploadTask = uploadBytesResumable(imgRef, centerImage, metadata);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Error uploading image:", error);
            errorAlert("Failed to upload image. Please try again.");
            reject(null);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("File available at", downloadURL);
              resolve(downloadURL);
            } catch (err) {
              console.error("Error getting download URL:", err);
              errorAlert("Failed to get image URL. Please try again.");
              reject(null);
            }
          }
        );
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      errorAlert("Image upload failed. Please try again.");
      return null;
    }
  };

  // Handle submit registration
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      errorAlert("Please fill out all fields and accept the terms.");
      return;
    }

    const downloadURL = await uploadImage();
    if (centerImage && !downloadURL) return; // If image upload failed, stop the signup process

    const lessorData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      sportcenter_name: sportName,
      operating_hours: {
        open: dayjs(openTime).format("hh:mma"),
        close: dayjs(closeTime).format("hh:mma"),
      },
      logo: downloadURL || photoURL,
      address: {
        street: street,
        state: state,
        city: city,
      },
      phone_number: phoneNumber,
      password: password,
      confirmPassword: confirmPassword,
    };

    dispatch(registerLessor(lessorData))
      .then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          notify("You will get contacted later.");
          resetForm();

          // 4s to navigate to home page
          setTimeout(() => {
            navigate("/");
          }, 4000);
        } else {
          errorAlert("Registration failed. Please try again.");
        }
      })
      .catch((e) => {
        console.error("Error registering user:", e);
        errorAlert("Registration failed");
      });
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setSportName("");
    setOpenTime(null);
    setCloseTime(null);
    setStreet("");
    setState("");
    setCity("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");
    setTermsAccepted(false);
    setFile(null);
    setCenterImage(null);
    setPhotoURL(null);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setCenterImage(selectedFile);
      setFile(URL.createObjectURL(selectedFile));
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: "2rem",
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            width: "50%",
            maxWidth: "600px",
          }}>
          <Typography variant="h4">Be a Lessor</Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8rem",
              margin: "1rem 0",
              padding: "0 1rem",
              textAlign: "justify",
            }}>
            Becoming a lessor of sports fields is an entrepreneurial venture
            that combines property management with sports enthusiasm. It
            involves acquiring or developing suitable land into well-maintained
            playing surfaces for various sports. As a lessor, you will be
            responsible for creating a system to rent out these fields to
            individuals, teams, leagues, and event organizers.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          marginTop: "2rem",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <FormControl
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "50%",
            flexDirection: "column",
            gap: "1rem",
          }}
          autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                color="secondary"
                type="email"
                value={email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                required
                onChange={(e) => setPhoneNumber(e.target.value)}
                variant="outlined"
                color="secondary"
                type="text"
                value={phoneNumber}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Firstname"
                required
                onChange={(e) => setFirstName(e.target.value)}
                variant="outlined"
                color="secondary"
                type="text"
                value={firstName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lastname"
                required
                variant="outlined"
                onChange={(e) => setLastName(e.target.value)}
                color="secondary"
                type="text"
                value={lastName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sport Center Name"
                required
                variant="outlined"
                onChange={(e) => setSportName(e.target.value)}
                color="secondary"
                type="text"
                value={sportName}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="From"
                  value={openTime}
                  onChange={(newValue) => setOpenTime(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth variant="outlined" />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Till"
                  value={closeTime}
                  onChange={(newValue) => setCloseTime(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth variant="outlined" />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Street"
                required
                variant="outlined"
                color="secondary"
                type="text"
                onChange={(e) => setStreet(e.target.value)}
                value={street}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                onChange={(e) => setState(e.target.value)}
                required
                variant="outlined"
                color="secondary"
                type="text"
                value={state}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                onChange={(e) => setCity(e.target.value)}
                label="City"
                required
                variant="outlined"
                color="secondary"
                type="text"
                value={city}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                color="secondary"
                type={showPassword ? "text" : "password"}
                value={password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="Confirm Password"
                required
                variant="outlined"
                color="secondary"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}>
                Upload Center Profile
                <VisuallyHiddenInput
                  onChange={handleImageChange}
                  type="file"
                  accept="image/*"
                />
              </Button>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "start",
                  marginTop: ".8rem",
                }}>
                {file && (
                  <img
                    loading="lazy"
                    width={400}
                    src={file}
                    alt="Select a file"
                  />
                )}
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              width: "100%",
            }}>
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
              }
              label="*Accept Terms & Conditions"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
              width: "100%",
              marginBottom: "2rem",
            }}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              onClick={handleSignUp}
              disabled={!isFormValid()}>
              Register
            </Button>
          </Box>
        </FormControl>
      </Box>
    </>
  );
}
