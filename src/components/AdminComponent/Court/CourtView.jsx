import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  TableCell,
  TableHead,
  Paper,
  TableBody,
  TableContainer,
  TableRow,
  Button,
  Modal,
  Typography,
  Divider,
  Box,
  Tooltip,
  Stack,
} from "@mui/material";
import axios from "axios";
import authToken from "../../../utils/authToken";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCourt from "./AddCourt";
import DeleteCourt from "./DeleteCourt";
import EditCourt from "./EditCourt";

export default function CourtView({ onClose, facilityId }) {
  const token = authToken();
  const [court, setCourt] = useState([]);
  const [courtId, setCourtId] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  //* add facility
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  //* delete facility
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  //* edit facility
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  console.log(facilityId);
  const getCourt = useCallback(async () => {
    try {
      const request = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessor/facility/${facilityId}/courts`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourt(request.data.facility.courts);
    } catch (err) {
      console.log(err.message);
    }
  }, [token, facilityId]);

  useEffect(() => {
    getCourt();
  }, [getCourt]);

  const listCourts = useMemo(() => {
    if (!court) return null;

    return court.map((data, key) => (
      <TableRow sx={{ overflow: "hidden", overflowY: "scroll" }} key={key}>
        <TableCell align="left">{data.name}</TableCell>
        <TableCell align="left" sx={{ width: "25%" }}>
          {data.description}
        </TableCell>

        <TableCell align="left" sx={{ width: "100px" }}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
              }}>
              {data.image.map((image, key) => (
                <img
                  loading="lazy"
                  key={key}
                  src={image}
                  width={100}
                  height={75}
                  alt="Facility image"
                />
              ))}
            </Box>
          </Box>
        </TableCell>

        <TableCell align="center">
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Tooltip title="Edit Court">
              <EditIcon
                onClick={() => {
                  handleOpenEdit();
                  setCourtId(data._id);
                }}
                style={{
                  fontSize: "20px",
                  color: "blue",
                  cursor: "pointer",
                }}
              />
            </Tooltip>

            <Tooltip title="Delete Court">
              <DeleteIcon
                onClick={() => {
                  handleOpenDelete();
                  setCourtId(data._id);
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
  }, [court]);
  return (
    <>
      {openAdd && (
        <AddCourt
          open={openAdd}
          closeModal={handleCloseAdd}
          updateModal={getCourt}
          facilityId={facilityId}
        />
      )}
      {openDelete && (
        <DeleteCourt
          open={openDelete}
          closeModal={handleCloseDelete}
          updateModal={getCourt}
          facilityId={facilityId}
          courtId={courtId}
        />
      )}
      {openEdit && (
        <EditCourt
          open={openEdit}
          closeModal={handleCloseEdit}
          updateModal={getCourt}
          facilityId={facilityId}
          courtId={courtId}
        />
      )}

      {court && court.length > 0 ? (
        <Modal
          keepMounted
          open={open}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description">
          <Box
            sx={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "80%",
              p: 4,
              borderRadius: "5px",
            }}>
            <Paper
              sx={{
                width: "100%",
                overflow: "hidden",
                overflowY: "scroll",
                padding: "15px",
                marginTop: "2rem",
              }}
              elevation={5}>
              <ClearIcon
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={onClose}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <Typography
                  display="flex"
                  alignItems="center"
                  gutterBottom
                  component="div"
                  variant="h6"
                  sx={{ padding: "14px", fontWeight: "bold" }}>
                  Court
                </Typography>
                <Button onClick={handleOpenAdd} variant="contained">
                  Create Court
                </Button>
              </Box>
              <Divider />
              <TableContainer style={{ height: "100%" }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>

                      <TableCell align="center">Image </TableCell>

                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{listCourts}</TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Modal>
      ) : (
        <Modal
          keepMounted
          open={open}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description">
          <Box
            sx={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: 500,
              p: 4,
              borderRadius: "5px",
            }}>
            <Paper
              sx={{
                width: "100%",
                overflow: "hidden",
                overflowY: "scroll",
                padding: "15px",
                marginTop: "2rem",
              }}
              elevation={5}>
              <ClearIcon
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={onClose}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <Typography
                  display="flex"
                  alignItems="center"
                  gutterBottom
                  component="div"
                  variant="h6"
                  sx={{ padding: "14px", fontWeight: "bold" }}>
                  Court
                </Typography>
                <Button onClick={handleOpenAdd} variant="contained">
                  Create Court
                </Button>
              </Box>
              <Divider />
              <Typography
                display="flex"
                justifyContent="start"
                alignItems="center"
                variant="h6"
                sx={{ padding: "14px" }}>
                No Courts
              </Typography>
            </Paper>
          </Box>
        </Modal>
      )}
    </>
  );
}
