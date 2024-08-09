import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "@mui/material";

import authToken from "../../../utils/authToken";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import Loader from "../../../components/Loader";

//* Fetching all comments from sport centers
const fetchComments = async (sportCenterId) => {
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
          sportCenterId, // Pass sportCenterId directly
        },
      }
    );

    const comments = response.data.comments;
    const pendingComments = comments.filter(
      (comment) => comment.status === "pending"
    );

    return pendingComments;
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
    queryKey: ["comments", sportCenterId],
    queryFn: () => fetchComments(sportCenterId),
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

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading comments.</p>;

  return (
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
        <Box sx={{ minWidth: 120, width: "25%", padding: "2rem" }}>
          <FormControl
            sx={{
              display: "flex",
            }}
            fullWidth>
            <InputLabel id="select-sport-center-label">Sport Center</InputLabel>
            <Select
              labelId="select-sport-center-label"
              value={sportCenterId}
              onChange={(e) => setSportCenterId(e.target.value)} // Set selected value here
            >
              {allLessors &&
                allLessors.map((lessor) => (
                  <MenuItem
                    value={lessor._id}
                    key={lessor._id}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: ".5rem",
                    }}>
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                      }}
                      src={lessor.logo}
                      alt="Lessor Logo"
                    />
                    <ListItemText primary={lessor.sportcenter_name} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
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
                    sx={{ width: "25%", textAlign: "justify" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "start",
                        gap: ".6rem",
                      }}>
                      <InsertCommentIcon sx={{ fontSize: "1rem" }} />
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
  );
}
