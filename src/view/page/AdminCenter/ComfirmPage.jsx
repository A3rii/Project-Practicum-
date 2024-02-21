import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
const columns = [
   { id: 'name', label: 'Name', minWidth: 150 },
   { id: 'court', label: 'Court', minWidth: 100 },
   {
      id: 'booking_date',
      label: 'Booking Date',
      minWidth: 100,
   },
   {
      id: 'booking_hours',
      label: 'Booking Hours',
      minWidth: 100,

   },
   {
      id: 'incoming_date',
      label: 'Incoming Date',
      minWidth: 100,
   },
   {
      id: 'sport_type ',
      label: 'Sport Type',
      minWidth: 100,
   },
   {
      id: 'action',
      label: 'Action',
      minWidth: 100,
   },

];


function createData(name, court, booking_date, booking_hours, incoming_date, sport_type) {
   return { name, court, booking_date, booking_hours, incoming_date, sport_type };
}

const rows = [
   createData('Kimly', 'A', "12. April .2024", 2, "21. April .2024", "football"),
   createData('Vimean', 'B', "12. April .2024", 3, "21. April .2024", "football"),
   createData('Limhor', 'B', "12. April .2024", 3, "21. April .2024", "football"),
   createData('Chamroung', 'B', "12. April .2024", 3, "21. April .2024", "football"),
]

export default function ConfirmPage() {


   return (
      <>

         <Paper sx={{ width: '100%', overflow: 'hidden', padding: "15px" }}>
            <Typography
               display="flex"
               alignItems="center"
               gutterBottom
               variant="h5"
               component="div"
               sx={{ padding: "14px" }}
            >
               Customer
            </Typography>
            <Divider />

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
                           <TableCell align="left" style={{ minWidth: "100px" }}>{row.name}</TableCell>
                           <TableCell align="left" style={{ minWidth: "100px" }}>{row.court}</TableCell>
                           <TableCell align="left" style={{ minWidth: "100px" }}>{row.booking_date}</TableCell>
                           <TableCell align="left" style={{ minWidth: "100px" }}>{row.booking_hours}</TableCell>
                           <TableCell align="left" style={{ minWidth: "100px" }}>{row.incoming_date}</TableCell>
                           <TableCell align="left" style={{ minWidth: "100px" }}>{row.sport_type}</TableCell>
                           <TableCell align="left" style={{ minWidth: "100px" }} >
                              <Stack direction="row" spacing={2}>
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
            </TableContainer>

         </Paper>

      </>
   );
}