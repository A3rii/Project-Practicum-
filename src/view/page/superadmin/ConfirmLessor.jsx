import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  Stack,
  Button,
  Modal,
  Typography,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import dayjs from "dayjs";
import authToken from "./../../../utils/authToken";
import Loader from "../../../components/Loader";
import { notify, errorAlert } from "./../../../utils/toastAlert";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch lessor for moderators
const fetchLessors = async (lessorId) => {
  const token = authToken();
  try {
    const getLessors = await axios.get(
      `${import.meta.env.VITE_API_URL}/moderator/find/lessors`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        // If there is no id provided , it will display all the lessors
        params: {
          lessorId,
        },
      }
    );
    const lessors = getLessors.data.lessors;
    const approvedLessor = lessors.filter(
      (lessor) => lessor.status === "pending"
    );
    return approvedLessor;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateLessorStatus = async ({ lessorId, status }) => {
  const token = authToken();
  try {
    const lessorUpdate = await axios.put(
      `${import.meta.env.VITE_API_URL}/moderator/update/lessors/${lessorId}`,
      { status },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return lessorUpdate.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

//* Information modal for specific lessor
const InformationModal = ({ lessorId }) => {
  const { data: lessorById } = useQuery({
    queryKey: ["lessorsById", lessorId],
    queryFn: () => fetchLessors(lessorId),
    enable: !!lessorId,
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "5px",
    p: 4,
  };
  return (
    <>
      <Button variant="text" onClick={handleOpen}>
        OverView
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
            component="h2">
            Lessor information
          </Typography>
          {lessorById?.length > 0 &&
            lessorById?.map((data, key) => (
              <Box key={key}>
                <Stack
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}>
                  <Avatar sx={{ width: 70, height: 70 }} src={data.logo} />
                </Stack>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Owner's Name : {data.first_name} {data.last_name}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Email : {data.email}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Phone Number : {data.phone_number}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Sport Center Name : {data.sportcenter_name}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Address : {data.address.street}, {data.address.state} ,{" "}
                  {data.address.city},
                </Typography>
                <Typography id="mo dal-modal-description" sx={{ mt: 2 }}>
                  Opening Hours : {data.operating_hours.open}-
                  {data.operating_hours.close}
                </Typography>
              </Box>
            ))}
        </Box>
      </Modal>
    </>
  );
};

export default function ConfirmLessor() {
  const queryClient = useQueryClient();
  const {
    data: lessors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lessors"],
    queryFn: () => fetchLessors(),
    refetchOnWindowFocus: true,
  });

  const mutation = useMutation({
    mutationFn: updateLessorStatus,
    onSuccess: () => {
      notify("lessors updated successfully");
      queryClient.invalidateQueries("lessors");
    },
    onError: () => {
      errorAlert("Error updating lessor status");
    },
  });

  const handleAcceptLessor = (status, lessorId) => {
    mutation.mutate({ status, lessorId });
  };

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

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
      <TableContainer sx={{ borderRadius: ".9rem" }} component={Paper}>
        <Table
          sx={{ minWidth: 600, fontSize: ".6rem" }}
          aria-label="simple table">
          <TableHead sx={{ background: "#f2f2f2" }}>
            <TableRow>
              <TableCell>Sport Center</TableCell>
              <TableCell align="center">Owner's Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone Number</TableCell>
              <TableCell align="center">Information</TableCell>
              <TableCell align="center">Register At</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              "&:hover": {
                background: "#e9e9e9",
              },
            }}>
            {lessors && lessors.length > 0 ? (
              lessors.map((data) => (
                <TableRow key={data._id}>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: ".6rem",
                      }}>
                      <Avatar sx={{ width: 36, height: 36 }} src={data.logo} />
                      {data.sportcenter_name}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {data.first_name} {data.last_name}
                  </TableCell>
                  <TableCell align="center">{data.email}</TableCell>{" "}
                  {/* Email */}
                  <TableCell align="center">{data.phone_number}</TableCell>
                  <TableCell align="center">
                    {<InformationModal lessorId={data._id} />}
                  </TableCell>
                  <TableCell align="center">
                    {dayjs(data.created_at).format("MMMM DD, YYYY")}
                  </TableCell>
                  {/* Phone Number */}
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "inline-block",
                        padding: "5px 10px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor: "orange",
                        color: "white",
                        borderRadius: "10px",
                        textAlign: "center",
                      }}>
                      {data.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        onClick={() => handleAcceptLessor("approved", data._id)}
                        variant="outlined"
                        color="success">
                        Accept
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleAcceptLessor("rejected", data._id)}
                        variant="outlined"
                        color="error">
                        Cancel
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No lessors available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
