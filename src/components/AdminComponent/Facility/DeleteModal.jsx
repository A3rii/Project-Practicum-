import "react-toastify/dist/ReactToastify.css";
import { Button, Modal, Divider, Box, Typography } from "@mui/material";
import { notify, errorAlert } from "./../../../utils/toastAlert";
import axios from "axios";
import authToken from "../../../utils/authToken";

export default function DeleteModal({ open, closeModal, id, updateModal }) {
  const token = authToken();

  const deleteFacility = async (id) => {
    try {
      const request = await axios.delete(
        `${import.meta.env.VITE_API_URL}/lessor/facility/${id}`,
        {
          headers: {
            Accept: `application/json`,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      closeModal();
      updateModal();
      notify("Facility delete successfully.");
      return request;
    } catch (err) {
      console.log(err.message);
      errorAlert("Fail To Delete");
    }
  };
  return (
    <Modal
      keepMounted
      open={open}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 200,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "5px",
        }}>
        <Typography
          gutterBottom
          sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
          Delete Facility
        </Typography>
        <Divider />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "1rem",
            gap: "1rem",
          }}>
          <Typography
            sx={{ width: "100%" }}
            id="outlined-multiline-static"
            rows={4}
            label="Description"
            variant="outlined">
            Are sure you want to delete this facility ?
          </Typography>
        </Box>

        <Divider sx={{ margin: "1rem 0", marginTop: "1rem" }} />
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
          <Button onClick={() => deleteFacility(id)} variant="outlined">
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
