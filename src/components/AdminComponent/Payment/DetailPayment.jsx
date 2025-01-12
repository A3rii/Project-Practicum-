import { Button, Modal, Divider, Box, Typography, Chip } from "@mui/material";
import { formatDate } from "./../../../utils/timeCalculation";
export default function DetailPayment({ open, closeModal, payment }) {
  return (
    <Modal
      keepMounted
      open={open}
      onClose={closeModal}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 450,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "5px",
        }}>
        <Typography
          gutterBottom
          sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
          Payment Details
        </Typography>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            gap: "1rem",
          }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              gap: "4px",
              flexDirection: "column",
            }}>
            <Chip
              label="Information"
              size="small"
              sx={{
                backgroundColor: "#e0f7fa",
                color: "#00796b",
                fontWeight: "500",
                marginTop: "1rem",
              }}
            />
            <Typography variant="h6" sx={{ fontSize: ".8rem" }}>
              Name: {payment?.user?.name}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: ".8rem" }}>
              Email: {payment?.user?.email}
            </Typography>{" "}
            <Typography variant="h6" sx={{ fontSize: ".8rem" }}>
              Phone: {payment?.user?.phone_number}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: ".8rem" }}>
              Status: {payment?.status}
            </Typography>
            <Chip
              label="Date and Time"
              size="small"
              sx={{
                backgroundColor: "#e0f7fa",
                color: "#00796b",
                fontWeight: "500",
                marginTop: "1rem",
              }}
            />
            <Typography variant="h6" sx={{ fontSize: ".8rem" }}>
              Date: {formatDate(payment?.booking?.date)}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: ".8rem" }}>
              Time:{payment?.booking?.startTime} - {payment?.booking?.endTime}
            </Typography>
            <Chip
              label="Sport Field"
              size="small"
              sx={{
                backgroundColor: "#e0f7fa",
                color: "#00796b",
                fontWeight: "500",
                marginTop: "1rem",
              }}
            />
            <Typography variant="h6" sx={{ fontSize: ".8rem" }}>
              Facility: {payment?.booking?.facility} - Court:{" "}
              {payment?.booking?.court}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          sx={{ marginTop: "1rem" }}
          color="error"
          onClick={closeModal}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
}
