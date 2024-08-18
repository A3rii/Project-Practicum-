import axios from "axios";
import authToken from "./../../../utils/authToken";
import Loader from "./../../../components/Loader";
import { useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import DeleteModal from "../../../components/Superadmin/DeleteModal";
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
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
const fetchLessors = async () => {
  const token = authToken();
  try {
    const getLessors = await axios.get(
      `${import.meta.env.VITE_API_URL}/moderator/find/lessors/ratings`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return getLessors.data.lessor;
  } catch (err) {
    throw new Error(err.message);
  }
};

export default function Lessor() {
  const [openDelete, setOpenDelete] = useState(false);
  const [sportCenterId, setSportCenterId] = useState(null);
  const [sportCenterName, setSportCenterName] = useState(null);
  const {
    data: lessors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lessors"],
    queryFn: fetchLessors,
  });

  //* delete facility
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  if (isLoading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <>
      {openDelete && (
        <DeleteModal
          open={openDelete}
          closeModal={handleCloseDelete}
          sportCenterId={sportCenterId}
          sportCenterName={sportCenterName}
        />
      )}
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
              <TableCell align="center">Rating</TableCell>
              <TableCell align="center">Register At</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessors && lessors.length > 0 ? (
              lessors.map((data) => (
                <TableRow
                  sx={{
                    "&:hover": {
                      background: "#e9e9e9",
                    },
                  }}
                  key={data._id}>
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
                  <TableCell align="center">{data.email}</TableCell>
                  <TableCell align="center">{data.phone_number}</TableCell>
                  <TableCell align="center">
                    {data.overallRating || 0}
                  </TableCell>
                  <TableCell align="center">
                    {dayjs(data.created_at).format("MMMM DD,YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        handleOpenDelete();
                        setSportCenterId(data._id);
                        setSportCenterName(data.sportcenter_name);
                      }}
                      startIcon={<DeleteIcon />}
                      color="error">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
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
