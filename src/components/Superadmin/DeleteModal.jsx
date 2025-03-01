import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify, errorAlert } from "./../../utils/toastAlert";
import { useState } from "react";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import authToken from "./../../utils/authToken";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

const deleteSportCenter = async (sportCenterId) => {
  const token = authToken();
  try {
    const removeSportCenter = await axios.delete(
      `${
        import.meta.env.VITE_API_URL
      }/moderator/delete/lessors/${sportCenterId}`,
      {
        headers: {
          Accept: `application/json`,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return removeSportCenter.data.message;
  } catch (err) {
    throw new Error(err);
  }
};
export default function DeleteModal({
  closeModal,
  open,
  sportCenterId,
  sportCenterName,
}) {
  const [confirmName, setConfirmName] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteSportCenter,
    onSuccess: () => {
      notify("Booking status updated");
      queryClient.invalidateQueries("lessors");
    },
    onError: () => {
      errorAlert("Error delete sport center");
    },
  });

  const handleDelete = (sportCenterId) => {
    if (!confirmName) return errorAlert("Please fill in the name");

    if (sportCenterName === confirmName) {
      mutation.mutate(sportCenterId);
      setTimeout(() => {
        closeModal();
      }, 3000);
    } else {
      errorAlert("Wrong sport center name");
    }
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
      <Modal
        keepMounted
        open={open}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 300,
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
              <PriorityHighIcon
                sx={{
                  background: "#EE4B2B",
                  color: "#fff",
                  borderRadius: "50%",
                }}
              />
              <Typography
                sx={{ width: "100%", fontSize: "1rem" }}
                variant="outlined">
                Before deleting sport center, please have an official agreement
                with lessor.
              </Typography>
            </Box>

            <Divider sx={{ width: "100%", margin: ".5rem 0" }} />

            <Typography
              sx={{ width: "100%" }}
              rows={4}
              label="Description"
              variant="outlined">
              To Confirm Please Write the "{sportCenterName}" in the box below
            </Typography>
            <TextField
              placeholder="Sport center name"
              onChange={(e) => setConfirmName(e.target.value)}
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
            <Button variant="outlined" color="error" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(sportCenterId)}
              variant="outlined">
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
