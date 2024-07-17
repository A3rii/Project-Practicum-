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
  Stack,
} from "@mui/material";
import { useEffect, useState, useMemo, useCallback } from "react";
import EditIcon from "@mui/icons-material/Edit";
import AddFacility from "../../../components/AdminComponent/Facility/AddFacility";
import EditModal from "../../../components/AdminComponent/Facility/EditModal";
import DeleteModal from "../../../components/AdminComponent/Facility/DeleteModal";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import authToken from "./../../../utils/authToken";
import CourtView from "../../../components/AdminComponent/Court/CourtView";

export default function Facility() {
  const token = authToken();
  const [id, setId] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCourt, setOpenCorut] = useState(false);

  const [facility, setFacility] = useState([]);
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
  const handleOpenCourt = () => setOpenCorut(true);
  const handleCloseCourt = () => setOpenCorut(false);

  const fetchFacilities = useCallback(async () => {
    try {
      const getFacility = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessor/facility`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFacility(getFacility.data.facilities);
    } catch (err) {
      console.log(err.message);
    }
  }, [token]);
  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  console.log(facility);

  const listFacilities = useMemo(() => {
    if (!facility) return null;

    return facility.map((data, key) => (
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
          </Stack>
        </TableCell>
      </TableRow>
    ));
  }, [facility]);

  return (
    <>
      <Button variant="contained" onClick={handleOpenAdd}>
        Create Facility
      </Button>
      {openAdd && (
        <AddFacility
          open={openAdd}
          closeModal={handleCloseAdd}
          updateModal={fetchFacilities}
        />
      )}
      {openDelete && (
        <DeleteModal
          open={openDelete}
          closeModal={handleCloseDelete}
          updateModal={fetchFacilities}
          id={id}
        />
      )}

      {openEdit && (
        <EditModal
          open={openEdit}
          closeModal={handleCloseEdit}
          updateModal={fetchFacilities}
          id={id}
        />
      )}
      {openCourt && <CourtView onClose={handleCloseCourt} facilityId={id} />}
      {facility && facility.length > 0 ? (
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            padding: "15px",
            marginTop: "2rem",
          }}
          elevation={5}>
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
              There is no product on the list
            </p>
          </td>
        </tr>
      )}
    </>
  );
}
