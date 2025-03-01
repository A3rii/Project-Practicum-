import {
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  List,
  ListItem,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

export default function LessorInformation({ lessor, closeModal, openModal }) {
  const lessorFacility = lessor.facilities;
  return (
    <Modal keepMounted open={openModal}>
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}>
        <CancelIcon
          onClick={closeModal}
          sx={{ fontSize: "1.5rem", textAlign: "right", cursor: "pointer" }}
        />
        <TableContainer
          sx={{ borderRadius: ".9rem", marginTop: "1rem" }}
          component={Paper}>
          <Table
            sx={{ minWidth: 600, fontSize: ".6rem" }}
            aria-label="simple table">
            <TableHead sx={{ background: "#f2f2f2" }}>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Facility</TableCell>
                <TableCell align="center">Court</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(lessorFacility) &&
                lessorFacility.length > 0 &&
                lessorFacility.map((data, index) => (
                  <TableRow
                    key={data.id}
                    sx={{
                      "&:hover": {
                        background: "#e9e9e9",
                      },
                    }}>
                    <TableCell align="center"> {index + 1} </TableCell>
                    <TableCell align="center"> {data.name} </TableCell>
                    <TableCell sx={{ width: "25%" }} align="center">
                      {Array.isArray(data.court) && data.court.length > 0
                        ? data.court.map((info) => (
                            <List sx={{ paddingLeft: "1.5rem" }} key={info.id}>
                              <ListItem
                                sx={{
                                  display: "list-item",
                                  listStylePosition: "disc",
                                  textAlign: "center",
                                  paddingLeft: 0,
                                  paddingTop: 0,
                                  paddingBottom: 0,
                                }}>
                                {info.name}
                              </ListItem>
                            </List>
                          ))
                        : "No courts available"}
                    </TableCell>
                    <TableCell align="center"> ${data.price}/hour</TableCell>
                    <TableCell align="center"> {data.description} </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
}
