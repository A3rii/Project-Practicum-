import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";


export default function HomeDash() {
  const columns = [
    { id: 'facilities', label: 'Facilities', minWidth: 150 },
    { id: 'description', label: 'Description', minWidth: 100 },
    { id: 'court', label: 'Court', minWidth: 100 },
    { id: 'image', label: 'Surrounding Image', minWidth: 100 },
    { id: 'action', label: 'Action', minWidth: 100, },

  ];


  function createData(facilities) {
    return { facilities };
  }

  const rows = [
    createData('Football'),
    createData('BasketBall'),

  ]
  return (
    <>

      {/* Admin's profile */}

      <div className='home-mainProfile'>
        <div className="home-profile">
          <Stack className='home-stack' >
            <Skeleton variant="circular" width={200} height={200} />
          </Stack>

          <div className='home-profilePicture'>
            <label htmlFor="home-addPicture" className="home-addPictureLabel">
              <AddAPhotoIcon
                style={{ fontSize: "25px", marginRight: "20px" }}
              />
            </label>
            <input type="file" id="home-addPicture" name="home-addPicture" accept="image/*" className="home-addPicture" />
          </div>

        </div>

        <div className="home-profileName">
          <span> Welcome Sport Center </span>
        </div>

      </div>







      {/* Table Information of Admin  */}

      <div className="home-tableInfo">

        <div className='home-editIcon' >
          <h5>Basic Information </h5>
          <EditIcon
            style={{ fontSize: "20px", marginBottom: "10px", cursor: "pointer" }}
          />
        </div>


        <TableContainer sx={{ maxWidth: 800 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableRow >
              <TableCell align="left">
                Owner Name:
              </TableCell>
              <TableCell align="right">
                Heng Long
              </TableCell>
            </TableRow>

            <TableRow >
              <TableCell align="left">
                Sport Center:
              </TableCell>
              <TableCell align="right">
                Complex Sport Center
              </TableCell>
            </TableRow>


            <TableRow >
              <TableCell align="left">
                Contact Number:
              </TableCell>
              <TableCell align="right">
                023-880-880
              </TableCell>
            </TableRow>


            <TableRow >
              <TableCell align="left">
                Address:
              </TableCell>
              <TableCell align="right">
                Toul Kork, Phnom Penh
              </TableCell>
            </TableRow>

          </Table>
        </TableContainer>
      </div>


      <div className="home-editSportcenter">
        <h5>Your Sport Facilities</h5>

        <Paper sx={{ width: "50rem", overflow: 'hidden', padding: "15px", marginTop: "1rem" }}>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}  >
                    <TableCell align="left" style={{ minWidth: "100px" }}>{row.facilities}</TableCell>


                    <TableCell align="left" style={{ minWidth: "100px" }}>
                      {row.description}
                      <Button variant="outlined">Edit </Button>
                    </TableCell>


                    {/*Should be input */}
                    <TableCell align="left" style={{ minWidth: "100px" }}>
                      {row.court}
                      <Button variant="outlined">Add</Button>
                    </TableCell>


                    {/*Should be input */}
                    <TableCell align="left" style={{ minWidth: "100px" }}>
                      {row.image}
                      <Button variant="outlined">Change </Button>
                    </TableCell>




                    <TableCell align="left" style={{ minWidth: "100px" }} >
                      <Stack direction="row" spacing={1}>
                        <CheckCircleIcon
                          style={{ fontSize: "20px", color: "green", cursor: "pointer" }}
                        />
                        <DeleteIcon
                          style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>

            </Table>
            <Divider />

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
              <Button variant="outlined" startIcon={<AddIcon />}>Add Facilities</Button>
            </div>
          </TableContainer>

        </Paper>
      </div>

    </>

  )
}
