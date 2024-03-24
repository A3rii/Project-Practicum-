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
  Grid,
  Divider,
  Box,
  Avatar,
  TextField,
} from "@mui/material";

import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import boy from "./../../../assets/BookingImags/boy.jpg";

export default function HomeDash() {
  // Database Management  static data
  const columns_facilities = [
    { id: "facilities", label: "Facilities", minWidth: 150 },
    { id: "description", label: "Description", minWidth: 100 },
    { id: "court", label: "Court", minWidth: 100 },
    { id: "image", label: "Surrounding Image", minWidth: 100 },
    { id: "action", label: "Action", minWidth: 100 },
  ];

  // database management static data
  const column_participant = [
    {
      id: 1,
      profile: <Avatar alt="K" src="#" />, // It must be the photo URL store somewhere "Cloudinary"
      name: "Snow Jon",
      email: "kimly@gmail.com",
    },
    {
      id: 2,
      profile: <Avatar alt="K" src="#" />,
      name: "Lannister Cersei",
      email: "kimly@gmail.com",
    },
    {
      id: 3,
      profile: <Avatar alt="K" src="#" />,
      name: "Lannister Jaime",
      email: "kimly@gmail.com",
    },
    {
      id: 4,
      profile: <Avatar alt="K" src="#" />,
      name: "Stark Arya",
      email: "kimly@gmail.com",
    },
    {
      id: 5,
      profile: <Avatar alt="K" src="#" />,
      name: "Targaryen Daenerys",
      email: "kimly@gmail.com",
    },
  ];

  function createData(facilities) {
    return { facilities };
  }

  const rows = [createData("Football"), createData("BasketBall")];
  return (
    <>
      {/* Admin's profile */}

      <div className="home-mainProfile">
        <div className="home-profile">
          <Stack className="home-stack">
            <Avatar alt="K" src={boy} sx={{ width: 200, height: 200 }} />
          </Stack>

          <div className="home-profilePicture">
            <label htmlFor="home-addPicture" className="home-addPictureLabel">
              <AddAPhotoIcon
                style={{ fontSize: "25px", marginRight: "20px" }}
              />
            </label>
            <input
              type="file"
              id="home-addPicture"
              name="home-addPicture"
              accept="image/*"
              className="home-addPicture"
            />
          </div>
        </div>

        <div className="home-profileName">
          <span> Welcome Sport Center </span>
        </div>
      </div>

      <Box sx={{ flexGrow: 1, marginTop: "5rem" }}>
        <Grid container spacing={2}>
          <Grid item xl={4} lg={4} sm={12} xs={12}>
            <Paper
              sx={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                padding: "15px",
              }}
              elevation={10}>
              <Typography
                display="flex"
                alignItems="center"
                gutterBottom
                component="div"
                variant="h6"
                sx={{ padding: "14px" }}>
                Basic Information
                <EditIcon
                  style={{
                    fontSize: "15px",
                    cursor: "pointer",
                    marginLeft: "5px",
                  }}
                />
              </Typography>
              <Divider />
              <TableContainer style={{ height: "100%" }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableRow>
                    <TableCell align="left">Owner Name:</TableCell>
                    <TableCell align="right">Heng Long</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell align="left">Sport Center:</TableCell>
                    <TableCell align="right">Complex Sport Center</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell align="left">Contact Number:</TableCell>
                    <TableCell align="right">023-880-880</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell align="left">Address:</TableCell>
                    <TableCell align="right">Toul Kork, Phnom Penh</TableCell>
                  </TableRow>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xl={8} lg={8} sm={12}>
            <Paper
              sx={{
                width: "100%",
                overflow: "hidden",
                padding: "15px",
              }}
              elevation={10}>
              <Typography
                display="flex"
                alignItems="center"
                gutterBottom
                component="div"
                variant="h6"
                sx={{ padding: "14px" }}>
                Facilities
              </Typography>
              <Divider />

              <TableContainer style={{ height: "100%" }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns_facilities.map((column) => (
                        <TableCell
                          key={column.id}
                          style={{ minWidth: column.minWidth }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="left" style={{ minWidth: "100px" }}>
                          {row.facilities}
                        </TableCell>

                        <TableCell align="left" style={{ minWidth: "100px" }}>
                          {row.description}
                          <Button variant="outlined">Edit </Button>{" "}
                          {/*Adding Modal */}
                        </TableCell>

                        {/*Should be input */}
                        <TableCell align="left" style={{ minWidth: "100px" }}>
                          {row.court}
                          <Button variant="outlined">Add</Button>{" "}
                          {/*Adding Modal */}
                        </TableCell>

                        {/*Should be input */}
                        <TableCell align="left" style={{ minWidth: "100px" }}>
                          {row.image}
                          <Button variant="outlined">Change </Button>{" "}
                          {/*Adding Modal */}
                        </TableCell>

                        {/** Should be added modal When clicking */}
                        <TableCell align="left" style={{ minWidth: "100px" }}>
                          <Stack direction="row" spacing={1}>
                            <CheckCircleIcon
                              style={{
                                fontSize: "20px",
                                color: "green",
                                cursor: "pointer",
                              }}
                            />
                            <DeleteIcon
                              style={{
                                fontSize: "20px",
                                color: "red",
                                cursor: "pointer",
                              }}
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Divider />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginTop: "1rem",
                  }}>
                  <Button variant="outlined" startIcon={<AddIcon />}>
                    Add Facilities
                  </Button>
                </div>
              </TableContainer>
            </Paper>
          </Grid>

          {/*Customer Recent books*/}
          <Grid item xl={12} lg={12} sm={12}>
            <Paper
              sx={{
                maxWidth: "100%",
                overflow: "hidden",
                padding: "15px",
                marginTop: "1rem",
              }}
              elevation={20}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}>
                <Typography
                  display="flex"
                  alignItems="center"
                  gutterBottom
                  component="div"
                  variant="h6"
                  sx={{ padding: "14px" }}>
                  Customer
                </Typography>
                <Box sx={{ maxWidth: "100%" }}>
                  <TextField
                    size="small"
                    sx={{ width: "20rem" }}
                    label="Search"
                  />
                </Box>
              </div>
              <Divider />

              <TableContainer style={{ maxHeight: "20rem" }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left"> ID</TableCell>
                      <TableCell align="left"> Profile</TableCell>
                      <TableCell align="center"> Name</TableCell>
                      <TableCell align="center"> Email </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {column_participant.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="left" style={{ minWidth: "100px" }}>
                          {row.id}
                        </TableCell>

                        <TableCell align="left" style={{ minWidth: "100px" }}>
                          {row.profile}
                        </TableCell>

                        <TableCell align="center" style={{ minWidth: "100px" }}>
                          {row.name}
                        </TableCell>

                        <TableCell align="center" style={{ minWidth: "100px" }}>
                          {row.email}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Table Information of Admin  */}
    </>
  );
}
