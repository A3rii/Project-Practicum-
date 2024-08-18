import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Avatar,
  Stack,
} from "@mui/material";
import UserChart from "../../../components/Superadmin/UserChart";
import SportsIcon from "@mui/icons-material/Sports";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PersonIcon from "@mui/icons-material/Person";
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
    return approvedLessors.length || 0;
  } catch (err) {
    throw new Error("Failed to fetch lessors.");
  }
};

const fetchingUsers = async () => {
  const token = authToken();
  try {
    const getUsers = await axios.get(
      `${import.meta.env.VITE_API_URL}/moderator/list/users`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return getUsers.data;
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
          background: "#EE4B2B",
          color: "#fff",
          borderRadius: "50%",
        }}
      />
    </Paper>
  );
}

function TotalUsers() {
  const { data: totalUsers } = useQuery({
    queryKey: ["totalUsers"],
    queryFn: fetchingUsers,
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
          Users
        </Typography>
        <Typography
          display="flex"
          alignItems="center"
          variant="h3"
          sx={{
            fontSize: "2.2rem",
            fontWeight: "bold",
          }}>
          {totalUsers?.total_users}
        </Typography>
      </Box>
      <PersonIcon
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

// List all user name
function ListUsers() {
  const { data: totalUsers } = useQuery({
    queryKey: ["totalUsers"],
    queryFn: fetchingUsers,
  });
  return (
    <Paper
      sx={{
        maxWidth: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
        borderRadius: ".8rem",
      }}
      elevation={3}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Typography
          display="flex"
          alignItems="center"
          component="div"
          variant="h6"
          sx={{ padding: "14px", fontWeight: "bold" }}>
          Users
        </Typography>
      </div>

      <TableContainer
        sx={{
          maxHeight: "20rem",
          overflow: "hidden",
          overflowY: "scroll",
          height: "15rem",
        }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left"> Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center"> Phone number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totalUsers && totalUsers.users.length > 0 ? (
              totalUsers.users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell align="left" style={{ minWidth: "100px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: ".5rem",
                      }}>
                      <Avatar
                        sx={{
                          width: 25,
                          height: 25,
                        }}
                      />
                      <Typography sx={{ fontSize: ".9rem" }}>
                        {user?.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center" style={{ minWidth: "100px" }}>
                    {user?.email}
                  </TableCell>
                  <TableCell align="center" style={{ minWidth: "100px" }}>
                    {user?.phone_number}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  No Match for today
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default function DashBoard() {
  return (
    <>
      <Stack sx={{ flexGrow: 1, marginTop: "1rem", margin: "1rem" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} xl={4} lg={4} sm={4}>
            <TotalApprovedLessor />
          </Grid>
          <Grid item xs={12} xl={4} lg={4} sm={4}>
            <TotalPendingLessor />
          </Grid>
          <Grid item xs={12} xl={4} lg={4} sm={4}>
            <TotalUsers />
          </Grid>
          <Grid item xs={12} xl={7} lg={4} sm={4}>
            <UserChart />
          </Grid>
          <Grid item xs={12} xl={5} lg={4} sm={4}>
            <ListUsers />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}
