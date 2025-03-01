import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { errorAlert } from "./../../utils/toastAlert";
import authToken from "./../../utils/authToken";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const editPhoneNumber = async (phoneNumber) => {
  try {
    const token = authToken();
    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}/auth/edit-user`,
      { phone_number: phoneNumber },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Error updating phone number"
    );
  }
};

export default function ModalForSocialUser({ open, close }) {
  const queryClient = useQueryClient();
  const [phoneNumber, setPhoneNumber] = useState("");

  // Validate phone number for Cambodia
  const validatePhoneNumber = (number) => {
    const phoneRegex = /^(?:\+855|0)[1-9][0-9]{7,8}$/;
    return phoneRegex.test(number);
  };

  const mutation = useMutation({
    mutationFn: editPhoneNumber,
    onSuccess: () => {
      queryClient.invalidateQueries("social_user");
      close();
    },
    onError: (error) => {
      errorAlert(error.message || "Error updating phone number");
    },
  });

  const handleConfirmPhoneNumber = () => {
    if (validatePhoneNumber(phoneNumber)) {
      mutation.mutate(phoneNumber);
    } else {
      errorAlert("Invalid phone number format");
    }
  };

  return (
    <Modal keepMounted open={open} onClose={close}>
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 250,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "1rem",
            gap: "1rem",
          }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: ".8rem",
            }}>
            <Typography
              sx={{ width: "100%", fontSize: "1rem" }}
              variant="outlined">
              As you are logging using a social account, please provide your
              phone number.
            </Typography>
          </Box>

          <TextField
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            id="fullWidth"
          />
        </Box>

        <Box
          sx={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            gap: "1rem",
          }}>
          <Button variant="outlined" color="error" onClick={close}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleConfirmPhoneNumber}>
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
