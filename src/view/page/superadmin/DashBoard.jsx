import { useQuery } from "@tanstack/react-query";
import CountUp from "react-countup";

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
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import UserChart from "../../../components/Superadmin/UserChart";
import SportsIcon from "@mui/icons-material/Sports";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PersonIcon from "@mui/icons-material/Person";
import { dashboardAPI } from "./../../../api/superadmin/index";

// Reusable MetricCard component
function MetricCard({ title, value, icon: Icon, color }) {
  return (
    <Paper
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        padding: "10px",
        borderRadius: "10px",
        color: "#000",
        height: { xs: "100px", sm: "130px", md: "150px" },
      }}
      elevation={3}>
      <Box sx={{ display: "flex", flexDirection: "column", padding: "1rem" }}>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "0.8rem", sm: "1rem" },
            color: "#666",
          }}>
          {title}
        </Typography>
        <Typography
          sx={{ fontSize: { xs: "1.6rem", sm: "2rem" }, fontWeight: "bold" }}>
          <CountUp start={0} end={parseInt(value)} duration={2.5} />
        </Typography>
      </Box>
      <Icon
        sx={{
          fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
          margin: "14px",
          padding: "10px",
          backgroundColor: color,
          color: "#fff",
          borderRadius: "50%",
        }}
      />
    </Paper>
  );
}

// Dashboard components
function TotalApprovedLessor() {
  const { data: lessors = [] } = useQuery({
    queryKey: ["lessors"],
    queryFn: dashboardAPI.fetchLessors,
  });
  const approvedCount = lessors.filter(
    (center) => center.status === "approved"
  ).length;

  return (
    <MetricCard
      title="Official Lessors"
      value={approvedCount}
      icon={SportsIcon}
      color="#2E8BC0"
    />
  );
}

function TotalPendingLessor() {
  const { data: lessors = [] } = useQuery({
    queryKey: ["lessors"],
    queryFn: dashboardAPI.fetchLessors,
  });
  const pendingCount = lessors.filter(
    (center) => center.status === "pending"
  ).length;

  return (
    <MetricCard
      title="Unofficial Lessors"
      value={pendingCount}
      icon={PendingActionsIcon}
      color="#EE4B2B"
    />
  );
}

function TotalUsers() {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: dashboardAPI.fetchUsers,
  });
  return (
    <MetricCard
      title="Users"
      value={data?.total_users || 0}
      icon={PersonIcon}
      color="orange"
    />
  );
}

function ListOpenSportCenter() {
  const { data: lessors = [] } = useQuery({
    queryKey: ["lessors"],
    queryFn: dashboardAPI.fetchLessors,
  });
  const openCount = lessors.filter((l) => l.time_availability).length;

  return (
    <MetricCard
      title="Online Centers"
      value={openCount}
      icon={SportsSoccerIcon}
      color="#00b300"
    />
  );
}

// List of Users Component
function ListUsers() {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: dashboardAPI.fetchUsers,
  });

  return (
    <Paper
      sx={{
        padding: { xs: "10px", sm: "15px" },
        borderRadius: ".8rem",
        maxWidth: "100%",
        height: "100%",
      }}
      elevation={3}>
      <Typography variant="h6" sx={{ padding: "14px", fontWeight: "bold" }}>
        Users
      </Typography>
      <TableContainer sx={{ maxHeight: { xs: "12rem", sm: "20rem" } }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone number / Provider</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.users?.length ? (
              data.users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".5rem",
                      }}>
                      <Avatar sx={{ width: 25, height: 25 }} />
                      <Typography sx={{ fontSize: ".9rem" }}>
                        {user?.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">{user?.email}</TableCell>
                  <TableCell align="center">
                    {user?.phone_number || user?.provider}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  No User
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

// Main Dashboard Component
export default function DashBoard() {
  return (
    <Stack sx={{ flexGrow: 1, marginTop: "1rem", margin: "1rem" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TotalApprovedLessor />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TotalPendingLessor />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TotalUsers />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ListOpenSportCenter />
        </Grid>
        <Grid item xs={12} md={7}>
          <UserChart />
        </Grid>
        <Grid item xs={12} md={5}>
          <ListUsers />
        </Grid>
      </Grid>
    </Stack>
  );
}
