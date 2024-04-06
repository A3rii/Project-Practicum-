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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import BookIcon from "@mui/icons-material/Book";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import boy from "./../../../assets/BookingImags/boy.jpg";

function TotalCustomer() {
  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
      }}
      elevation={5}>
      <Typography
        display="flex"
        alignItems="center"
        component="div"
        variant="h5"
        sx={{ padding: "14px", fontWeight: "bold" }}>
        Total Customer
      </Typography>
      <div className="admin-totalCustomer">
        <AccountCircleIcon sx={{ fontSize: "2rem" }} />
        <Typography
          display="flex"
          alignItems="center"
          variant="h3"
          sx={{
            padding: "14px",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}>
          200
        </Typography>
      </div>
    </Paper>
  );
}
function MatchAcception() {
  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
      }}
      elevation={5}>
      <Typography
        display="flex"
        alignItems="center"
        component="div"
        variant="h5"
        sx={{ padding: "14px", fontWeight: "bold" }}>
        Total Acception
      </Typography>
      <div className="admin-totalAcception">
        <CheckCircleIcon sx={{ fontSize: "2rem", color: "#34A853" }} />
        <Typography
          display="flex"
          alignItems="center"
          variant="h3"
          sx={{
            padding: "14px",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}>
          200
        </Typography>
      </div>
    </Paper>
  );
}

function TotalBooking() {
  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
      }}
      elevation={5}>
      <Typography
        display="flex"
        alignItems="center"
        component="div"
        variant="h5"
        sx={{ padding: "14px", fontWeight: "bold" }}>
        Total Booking
      </Typography>
      <div className="admin-totalBooking">
        <BookIcon sx={{ fontSize: "2rem" }} />
        <Typography
          display="flex"
          alignItems="center"
          variant="h3"
          sx={{
            padding: "14px",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}>
          200
        </Typography>
      </div>
    </Paper>
  );
}

function CustomerTable() {
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

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        overflow: "hidden",
        padding: "15px",
        marginTop: "1rem",
      }}
      elevation={5}>
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
          sx={{ padding: "14px", fontWeight: "bold" }}>
          Customer
        </Typography>
        <Box sx={{ maxWidth: "100%" }}>
          <TextField size="small" sx={{ width: "20rem" }} label="Search" />
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
  );
}

function SportInformationTable() {
  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "15px",
      }}
      elevation={5}>
      <Typography
        display="flex"
        alignItems="center"
        gutterBottom
        component="div"
        variant="h6"
        sx={{ padding: "14px", fontWeight: "bold" }}>
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
  );
}

function FacilitiesTable() {
  // Database Management  static data
  const columns_facilities = [
    { id: "facilities", label: "Facilities", minWidth: 150 },
    { id: "description", label: "Description", minWidth: 100 },
    { id: "court", label: "Court", minWidth: 100 },
    { id: "image", label: "Surrounding Image", minWidth: 100 },
    { id: "action", label: "Action", minWidth: 100 },
  ];
  function createData(facilities) {
    return { facilities };
  }
  const rows = [createData("Football"), createData("BasketBall")];

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        padding: "15px",
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
                  <Button variant="outlined">Edit </Button>
                  {/*Adding Modal */}
                </TableCell>

                {/*Should be input */}
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  {row.court}
                  <Button variant="outlined">Add</Button>
                  {/*Adding Modal */}
                </TableCell>

                {/*Should be input */}
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  {row.image}
                  <Button variant="outlined">Change </Button>
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
  );
}

export default function HomeDash() {
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
          {/*Total Customer Preview*/}

          <Grid item xs={12} xl={4} lg={4} sm={4}>
            <TotalCustomer />
          </Grid>
          {/*Total Match Accept Preview*/}

          <Grid item xs={12} xl={4} lg={4} sm={4}>
            <MatchAcception />
          </Grid>

          {/*Total Booking Preview*/}

          <Grid item xl={4} lg={4} sm={4} xs={12}>
            <TotalBooking />
          </Grid>

          {/*Basic Information of sport center*/}

          <Grid item xl={4} lg={4} sm={12} xs={12}>
            <SportInformationTable />
          </Grid>

          {/*Facilities Inforamtion */}

          <Grid item xl={8} lg={8} sm={12}>
            <FacilitiesTable />
          </Grid>

          {/*Customer Recent books*/}
          <Grid item xl={12} lg={12} sm={12}>
            <CustomerTable />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
