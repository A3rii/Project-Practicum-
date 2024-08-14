import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Paper, Grid } from "@mui/material";
import SportsIcon from "@mui/icons-material/Sports";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import authToken from "./../../../utils/authToken";

const fetchingLessors = async (status) => {
  const token = authToken();
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/moderator/find/lessors`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const lessors = response.data.lessors;
    // Get Only Approved Status
    const approvedLessors = lessors.filter(
      (lessor) => lessor.status === status
    );
    return approvedLessors.length;
  } catch (err) {
    throw new Error("Failed to fetch lessors.");
  }
};

// Get The Offical Lessor in the systems
function TotalApprovedLessor() {
  // List all the lessors to filter the confirmation
  const { data: totalLessors } = useQuery({
    queryKey: ["totalLessors", "approved"],
    queryFn: () => fetchingLessors("approved"),
  });

  return (
    <Paper
      sx={{
        width: "80%",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        overflow: "hidden",
        padding: "10px",
        color: "#000",
        borderRadius: "10px",
      }}
      elevation={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          flexDirection: "column",
          padding: "1.2rem",
          gap: "1rem",
        }}>
        <Typography
          display="flex"
          alignItems="center"
          component="div"
          sx={{ fontWeight: "bold", fontSize: "1rem", color: "#666666" }}>
          Official Lessors
        </Typography>
        <Typography
          display="flex"
          alignItems="center"
          variant="h3"
          sx={{
            fontSize: "2.2rem",
            fontWeight: "bold",
          }}>
          {totalLessors}
        </Typography>
      </Box>
      <SportsIcon
        sx={{
          fontSize: "4rem",
          margin: "14px",
          padding: "10px",
          background: "#2E8BC0",
          color: "#fff",
          borderRadius: "50%",
        }}
      />
    </Paper>
  );
}

// Get The Offical Lessor in the systems
function TotalPendingLessor() {
  // List all the lessors to filter the confirmation
  const { data: totalLessors } = useQuery({
    queryKey: ["totalLessors", "pending"],
    queryFn: () => fetchingLessors("pending"),
  });

  return (
    <Paper
      sx={{
        width: "80%",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        overflow: "hidden",
        padding: "10px",
        color: "#000",
        borderRadius: "10px",
      }}
      elevation={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          flexDirection: "column",
          padding: "1.2rem",
          gap: "1rem",
        }}>
        <Typography
          display="flex"
          alignItems="center"
          component="div"
          sx={{ fontWeight: "bold", fontSize: "1rem", color: "#666666" }}>
          Unofficial Lessors
        </Typography>
        <Typography
          display="flex"
          alignItems="center"
          variant="h3"
          sx={{
            fontSize: "2.2rem",
            fontWeight: "bold",
          }}>
          {totalLessors}
        </Typography>
      </Box>
      <PendingActionsIcon
        sx={{
          fontSize: "4rem",
          margin: "14px",
          padding: "10px",
          background: "orange",
          color: "#fff",
          borderRadius: "50%",
        }}
      />
    </Paper>
  );
}

export default function DashBoard() {
  return (
    <>
      <Box sx={{ flexGrow: 1, marginTop: "1rem" }}>
        <Grid container>
          <Grid item xs={12} xl={4} lg={4} sm={4}>
            <TotalApprovedLessor />
          </Grid>
          <Grid item xs={12} xl={4} lg={4} sm={4}>
            <TotalPendingLessor />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
