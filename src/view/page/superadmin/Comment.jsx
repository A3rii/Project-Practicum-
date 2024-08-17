import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import { notify, errorAlert } from "../../../utils/toastAlert";
import {
  Table,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Button,
  Box,
  Avatar,
  Typography,
  Divider,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  ListItemText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Popover,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import authToken from "../../../utils/authToken";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import Loader from "../../../components/Loader";

//* Fetching all comments from sport centers
const fetchComments = async (sportCenterId, status) => {
  const token = authToken();
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/posts/comments`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          sportCenterId,
          status,
        },
      }
    );

    return response.data.comments;
  } catch (err) {
    console.error("Error fetching comments:", err);
    throw new Error("Failed to fetch comments. Please try again later.");
  }
};

//* Update status for comment to sport center
const updateCommentStatus = async ({ status, commentId }) => {
  const token = authToken();
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/user/posts/comments/${commentId}`,
      { status },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error updating comment status:", err);
    throw new Error("Failed to update comment status. Please try again later.");
  }
};

export default function Comment() {
  const queryClient = useQueryClient();
  const [sportCenterId, setSportCenterId] = useState("");
  const [status, setStatus] = useState("pending");

  console.log(status);

  // Handle Popover event open and close
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleFilterChange = (event) => {
    setStatus(event.target.value);
    handleClose(); // Close the popover after selection
  };

  // List all the lessors to filter the confirmation
  const { data: allLessors } = useQuery({
    queryKey: ["allLessors"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessor/auth/informations`
      );
      return response.data.lessors;
    },
  });

  // Get all comments
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", sportCenterId, status],
    queryFn: () => fetchComments(sportCenterId, status),
    enabled: !!sportCenterId, // Only run query if sportCenterId is selected
    refetchOnWindowFocus: true,
  });

  const mutation = useMutation({
    mutationFn: updateCommentStatus,
    onSuccess: () => {
      notify("Comment status updated successfully");
      queryClient.invalidateQueries(["comments"]);
    },
    onError: () => {
      errorAlert("Error updating comment status");
    },
  });

  // Handle accept or reject comments
  const handleAccept = (status, commentId) => {
    mutation.mutate({ status, commentId });
  };

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "#00FF00";
      case "rejected":
        return "#EB1C1C";
      case "pending":
        return "orange";
      default:
        return "gray";
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading comments.</p>;

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
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          height: "max-content",
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}>
          <Typography
            display="flex"
            alignItems="center"
            gutterBottom
            variant="h6"
            component="div"
            sx={{ padding: "2rem", fontWeight: "bold" }}>
            Pending Comments
          </Typography>

          <Box
            sx={{
              minWidth: 120,
              width: "30%",
              padding: "2rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: ".5rem",
            }}>
            <FormControl fullWidth>
              <InputLabel id="select-sport-center-label">
                Sport Center
              </InputLabel>
              <Select
                labelId="select-sport-center-label"
                value={sportCenterId}
                onChange={(e) => setSportCenterId(e.target.value)}>
                {allLessors &&
                  allLessors.map((lessor) => (
                    <MenuItem
                      value={lessor._id}
                      key={lessor._id}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: ".4rem",
                      }}>
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                        }}
                        loading="lazy"
                        src={lessor.logo}
                        alt="Lessor Logo"
                      />
                      <ListItemText primary={lessor.sportcenter_name} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FilterAltIcon
              aria-describedby={id}
              onClick={handleClick}
              style={{
                fontSize: "1.5rem",
                marginRight: "20px",
                cursor: "pointer",
              }}
            />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}>
              <FormControl
                sx={{
                  width: "10rem",
                  padding: "1rem",
                }}>
                <RadioGroup
                  value={status}
                  onChange={handleFilterChange}
                  name="radio-buttons-group">
                  <FormControlLabel
                    value="pending"
                    control={<Radio />}
                    label="Pending"
                  />
                  <FormControlLabel
                    value="approved"
                    control={<Radio />}
                    label="Approved"
                  />
                  <FormControlLabel
                    value="rejected"
                    control={<Radio />}
                    label="Rejected"
                  />
                </RadioGroup>
              </FormControl>
            </Popover>
          </Box>
        </Box>

        <Divider />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ background: "#858585" }}>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Comments</TableCell>
                <TableCell align="center">Post By</TableCell>
                <TableCell align="center">Sport Center</TableCell>
                <TableCell align="center">Comment At</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments && comments.length > 0 ? (
                comments.map((data, index) => (
                  <TableRow key={data._id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell
                      align="center"
                      sx={{ width: "20%", textAlign: "center" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "start",
                          gap: ".6rem",
                        }}>
                        <InsertCommentIcon sx={{ fontSize: ".7rem" }} />
                        {data.comment}
                      </Box>
                    </TableCell>
                    <TableCell align="center">{data.postBy.name}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: ".6rem",
                        }}>
                        <Avatar
                          sx={{ width: 36, height: 36 }}
                          src={data.postTo.logo}
                        />
                        {data.postTo.sportcenter_name}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {dayjs(data.commentedAt).format("MMMM DD, YYYY")} at{" "}
                      {dayjs(data.commentedAt).format("hh:mm a")}
                    </TableCell>
                    <TableCell align="center">{data.ratingValue}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "inline-block",
                          padding: "5px 10px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor: statusColor(data.status),
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
                          onClick={() => handleAccept("approved", data._id)}
                          variant="outlined"
                          color="success">
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleAccept("rejected", data._id)}
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
                  <TableCell colSpan={7} align="center">
                    No comments available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
