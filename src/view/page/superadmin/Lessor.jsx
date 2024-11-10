import authToken from "./../../../utils/authToken";
import Loader from "./../../../components/Loader";
import { useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import LessorInformation from "../../../components/Superadmin/LessorInformation";
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
  Stack,
  Button,
} from "@mui/material";
import { Delete as DeleteIcon, Info as InfoIcon } from "@mui/icons-material";
import { resetPasswordAPI } from "./../../../api/superadmin/index";
export default function Lessor() {
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [sportCenterId, setSportCenterId] = useState(null);
  const [sportCenterName, setSportCenterName] = useState(null);
  const [sportCenterDetails, setSportCenterDetails] = useState(null);
  const token = authToken();
  const {
    data: lessors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lessors", token],
    queryFn: () => resetPasswordAPI.fetchLessors(token),
  });

  //* delete facility
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  //* open details
  const handleOpenDetails = () => setOpenDetails(true);
  const handleCloseDetails = () => setOpenDetails(false);

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
      {openDetails && (
        <LessorInformation
          openModal={openDetails}
          closeModal={handleCloseDetails}
          lessor={sportCenterDetails}
        />
      )}

      <TableContainer sx={{ borderRadius: ".9rem" }} component={Paper}>
        <Table
          sx={{ minWidth: 600, fontSize: ".6rem" }}
          aria-label="simple table">
          <TableHead sx={{ background: "#f2f2f2" }}>
            <TableRow>
              <TableCell>ID</TableCell>
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
              lessors.map((data, index) => (
                <TableRow
                  sx={{
                    "&:hover": {
                      background: "#e9e9e9",
                    },
                  }}
                  key={data._id}>
                  <TableCell>{index + 1}</TableCell>
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
                    <Stack direction="row" spacing={2}>
                      <Button
                        onClick={() => {
                          handleOpenDetails();
                          setSportCenterDetails(data);
                        }}
                        startIcon={<InfoIcon />}
                        variant="outlined">
                        Details
                      </Button>
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
                    </Stack>
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
