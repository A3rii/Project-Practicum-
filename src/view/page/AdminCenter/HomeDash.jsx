import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import EditIcon from '@mui/icons-material/Edit';



export default function HomeDash() {
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

    </>

  )
}
