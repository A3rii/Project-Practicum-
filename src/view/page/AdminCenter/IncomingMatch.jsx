import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox' } };

const columns = [
   { id: 'name', label: 'Name', minWidth: 150 },
   { id: 'court', label: 'Court', minWidth: 100 },

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
      id: 'status',
      label: 'Status',
      minWidth: 100,
   },
   {
      id: 'action',
      label: 'Action',
      minWidth: 100,
   },

];


function createData(name, court, booking_hours, incoming_date, sport_type, status) {
   return { name, court, booking_hours, incoming_date, sport_type, status };
}

const rows = [
   createData('Kimly', 'A', 2, "21. April .2024", "football", "Incoming"),
   createData('Vimean', 'B', 3, "21. April .2024", "football", "Incoming"),
   createData('Chamroung', 'B', 3, "21. April .2024", "football", "Incoming"),
]

export default function IncomingMatch() {


   return (
      <>

         <Paper
            sx={{
               width: '75rem',
               overflow: 'hidden',
               padding: "15px",
               marginTop: "2rem",
               marginLeft: "2rem"
            }}

            elevation={15}>
            <Typography
               display="flex"
               alignItems="center"
               gutterBottom
               variant="h5"
               component="div"
               sx={{ padding: "14px" }}
            >
               Incoming Match
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
                           <TableCell align="left" style={{ minWidth: "100px" }}>{row.booking_hours}</TableCell>
                           <TableCell align="left" style={{ minWidth: "100px" }}>{row.incoming_date}</TableCell>
                           <TableCell align="left" style={{ minWidth: "100px" }}>{row.sport_type}</TableCell>
                           <TableCell align="left" style={{ minWidth: "100px" }}>{row.status}</TableCell>
                           <TableCell align="left" style={{ minWidth: "100px" }} >
                              <Stack direction="row" >
                                 <Checkbox {...label} color="success" />
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