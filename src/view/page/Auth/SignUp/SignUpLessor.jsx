import {
  TextField,
  Button,
  Box,
  FormControl,
  Grid,
  Checkbox,
  Typography,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerLessor } from "./../../../../app/slice.js";
import { useDispatch } from "react-redux";

export default function SignUpLessor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [sportName, setSportName] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [street, setStreet] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

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

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    const lessorData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      sportcenter_name: sportName,
      operating_hours: {
        open: openTime,
        close: closeTime,
      },
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
      .then(() => {
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setSportName("");
        setOpenTime("");
        setCloseTime("");
        setStreet("");
        setState("");
        setCity("");
        setTermsAccepted(false);
        navigate("/");
      })
      .catch((e) => {
        console.error("Error registering user:", e.messages);
      });
  };

  return (
    <>
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
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Open Time"
                required
                variant="outlined"
                onChange={(e) => setOpenTime(e.target.value)}
                color="secondary"
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Close Time"
                required
                variant="outlined"
                color="secondary"
                onChange={(e) => setCloseTime(e.target.value)}
                type="text"
              />
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
                type="password"
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
                type="password"
              />
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
