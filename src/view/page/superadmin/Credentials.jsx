import { resetPasswordAPI } from "../../../api/superadmin/index";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notify, errorAlert } from "./../../../utils/toastAlert";
import authToken from "../../../utils/authToken";
import {
  Paper,
  Avatar,
  Box,
  Button,
  Modal,
  Typography,
  InputAdornment,
  IconButton,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Credentials() {
  const token = authToken();
  const queryClient = useQueryClient();

  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [selectedLessor, setSelectedLessor] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const [credentials, setCredentials] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleOpenResetModal = (lessor) => {
    setSelectedLessor(lessor);
    setOpenResetPassword(true);
    setCredentials({ password: "", confirmPassword: "" });
  };

  const handleCloseResetModal = () => setOpenResetPassword(false);

  const { data: lessors } = useQuery({
    queryKey: ["lessors", token],
    queryFn: () => resetPasswordAPI.fetchLessors(token),
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }, []);

  const updateCredentials = useMutation({
    mutationFn: (credentials) =>
      resetPasswordAPI.resetPassword(token, selectedLessor._id, credentials),
    onSuccess: () => {
      notify("Password Changed Successfully");
      queryClient.invalidateQueries({ queryKey: ["lessors"] });
      handleCloseResetModal();
    },
    onError: () => {
      errorAlert("Update Error");
    },
  });

  const handleUpdateCredentials = () => {
    if (credentials.password !== credentials.confirmPassword) {
      return errorAlert("Passwords do not match");
    }
    updateCredentials.mutate({
      password: credentials.password,
    });
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
      <Modal open={openResetPassword} onClose={handleCloseResetModal}>
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
            }}>
            <Typography sx={{ fontSize: "1rem" }}>
              Password Reset for {selectedLessor?.email}
            </Typography>
            <TextField
              fullWidth
              label="New Password"
              required
              onChange={handleChange}
              name="password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={credentials.password}
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
            <TextField
              fullWidth
              label="Confirm Password"
              required
              onChange={handleChange}
              name="confirmPassword"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={credentials.confirmPassword}
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateCredentials}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      <Paper
        sx={{
          width: "50%",
          maxWidth: "100%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
        {lessors && lessors.length > 0 ? (
          lessors.map((lessor, key) => (
            <Box
              key={key}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                gap: 2,
              }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar sx={{ width: 36, height: 36 }} src={lessor.logo} />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography>{lessor.sportcenter_name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {lessor.email}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                onClick={() => handleOpenResetModal(lessor)}>
                Reset Password
              </Button>
            </Box>
          ))
        ) : (
          <Typography>No lessors found</Typography>
        )}
      </Paper>
    </>
  );
}
