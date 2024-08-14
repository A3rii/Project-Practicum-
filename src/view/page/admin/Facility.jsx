import {
  Table,
  TableCell,
  TableHead,
  Paper,
  TableBody,
  TableContainer,
  TableRow,
  Button,
  Typography,
  Divider,
  Box,
  Tooltip,
  Stack,
} from "@mui/material";
import { useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import AddFacility from "../../../components/AdminComponent/Facility/AddFacility";
import AddIcon from "@mui/icons-material/Add";
import EditModal from "../../../components/AdminComponent/Facility/EditModal";
import DeleteModal from "../../../components/AdminComponent/Facility/DeleteModal";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import authToken from "./../../../utils/authToken";
import { ToastContainer } from "react-toastify";
import CourtView from "../../../components/AdminComponent/Court/CourtView";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../components/Loader";

export default function Facility() {
  const token = authToken();
  const [id, setId] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCourt, setOpenCourt] = useState(false);

  //* add facility
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  //* delete facility
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  //* edit facility
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  //* Court Open
  const handleOpenCourt = () => setOpenCourt(true);
  const handleCloseCourt = () => setOpenCourt(false);

  // Fetch data from server using useQuery
  const {
    data: facilities,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessor/facility`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.facilities;
    },

    refetchOnWindowFocus: true, // refetch to update the information
  });

  // List all facilities that lessor has
  const listFacilities = useMemo(() => {
    if (!facilities) return null;

    return facilities.map((data, key) => (
      <TableRow key={key}>
        <TableCell align="left">{data.name}</TableCell>
        <TableCell align="left" sx={{ width: "25%" }}>
          {data.description}
        </TableCell>

        <TableCell align="left">{data.price}</TableCell>
        <TableCell align="left" sx={{ width: "100px" }}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <img
              src={data.image}
              alt="Facility image"
              loading="lazy"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </TableCell>

        <TableCell align="left">
          <Button
            onClick={() => {
              handleOpenCourt();
              setId(data._id);
            }}
            variant="outlined">
            View
          </Button>
        </TableCell>

        <TableCell align="left">
          <Stack direction="row" spacing={1}>
            <Tooltip title="Edit Facility">
              <EditIcon
                onClick={() => {
                  handleOpenEdit();
                  setId(data._id);
                }}
                style={{
                  fontSize: "20px",
                  color: "blue",
                  cursor: "pointer",
                }}
              />
            </Tooltip>

            <Tooltip title="Delete Facility">
              <DeleteIcon
                onClick={() => {
                  handleOpenDelete();
                  setId(data._id);
                }}
                style={{
                  fontSize: "20px",
                  color: "red",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
    ));
  }, [facilities]);

  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching data</p>;

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
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenAdd}>
        Create Facility
      </Button>
      {openAdd && (
        <AddFacility
          open={openAdd}
          closeModal={handleCloseAdd}
          updateModal={refetch}
        />
      )}
      {openDelete && (
        <DeleteModal
          open={openDelete}
          closeModal={handleCloseDelete}
          updateModal={refetch}
          id={id}
        />
      )}

      {openEdit && (
        <EditModal
          open={openEdit}
          closeModal={handleCloseEdit}
          updateModal={refetch}
          id={id}
        />
      )}
      {openCourt && <CourtView onClose={handleCloseCourt} facilityId={id} />}
      {facilities && facilities.length > 0 ? (
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            padding: "15px",
            marginTop: "2rem",
          }}>
          <Typography
            display="flex"
            alignItems="center"
            gutterBottom
            component="div"
            variant="h6"
            sx={{ padding: "14px", fontWeight: "bold" }}>
            Facilities
          </Typography>
          <Divider />
          <TableContainer style={{ height: "100%" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price </TableCell>
                  <TableCell>Image </TableCell>
                  <TableCell>Court </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{listFacilities}</TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <tr>
          <td
            colSpan="7"
            className="p-4 border-b border-blue-gray-50 text-center">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
              There is no facility on the list
            </p>
          </td>
        </tr>
      )}
    </>
  );
}
