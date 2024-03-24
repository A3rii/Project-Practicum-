import {
   Paper, Typography, Divider, TableContainer, Table, TableHead,
   TableBody, TableRow, TableCell, Button, Stack, TextField, Box,
   Popover, Radio, RadioGroup, FormControlLabel, FormControl,
} from '@mui/material';
import { useState } from "react"
import FilterAltIcon from '@mui/icons-material/FilterAlt';


export default function ConfirmPage() {

   {/*Popover*/ }
   const [anchorEl, setAnchorEl] = useState(null);

   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const open = Boolean(anchorEl);
   const id = open ? 'simple-popover' : undefined;
   {/*Popover*/ }



   const columns = [
      { id: 'name', label: 'NAME', minWidth: 150 },
      { id: 'court', label: 'COURT', minWidth: 100 },
      { id: 'price', label: 'PRICE', minWidth: 100 },
      { id: 'booking_date', label: 'BOOKING DATE', minWidth: 100, },
      { id: 'booking_hours', label: 'BOOKING HOURS', minWidth: 100 },
      { id: 'incoming_date', label: 'INCOMING DATE', minWidth: 100 },
      { id: 'sport_type ', label: 'SPORT TYPE', minWidth: 100 },
      { id: 'action', label: 'ACTION', minWidth: 100, },

   ];


   function createData(name, court, price, booking_date, booking_hours, incoming_date, sport_type) {
      return { name, court, price, booking_date, booking_hours, incoming_date, sport_type };
   }

   const rows = [
      createData('Kimly', 'A', "10$", "12. April .2024", 2, "21. April .2024", "Basketball"),
      createData('Vimean', 'B', "10$", "12. April .2024", 3, "21. April .2024", "Football"),
      createData('Limhor', 'B', "10$", "12. April .2024", 3, "21. April .2024", "Volleyball"),
      createData('Chamroung', 'B', "10$", "12. April .2024", 3, "21. April .2024", "Football"),
   ]
   return (
      <>
         <Paper
            sx={{
               maxWidth: '100%',
               overflow: 'hidden',
               padding: "15px",
               marginTop: "2rem",
               marginLeft: "2rem"
            }}

            elevation={15}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
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

               <div style={{ display: 'flex', justifyContent: "center", alignContent: 'center', gap: '1rem' }}>
                  <Box sx={{ maxWidth: '100%', }}>
                     <TextField
                        size="small"
                        sx={{ width: '20rem' }}
                        label="Search" />
                  </Box>
                  <FilterAltIcon
                     aria-describedby={id} variant="contained" onClick={handleClick}
                     style={{ fontSize: "2rem", marginRight: "20px", cursor: "pointer" }} />
                  <Popover
                     id={id}
                     open={open}
                     anchorEl={anchorEl}
                     onClose={handleClose}
                     anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                     }} >

                     {/*Content Filter Here*/}

                     <FormControl
                        sx={{ width: "10rem", height: "10rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <RadioGroup name="radio-buttons-group">
                           <FormControlLabel value="other" control={<Radio />} label="All" />
                           <FormControlLabel value="female" control={<Radio />} label="Today" />
                           <FormControlLabel value="male" control={<Radio />} label="Sport Type" />
                        </RadioGroup>
                     </FormControl>

                  </Popover>
               </div>
            </div>

            <Divider />

            <TableContainer style={{ maxHeight: '30rem' }} >
               <Table stickyHeader aria-label="sticky table" >
                  <TableHead>
                     <TableRow>
                        {columns.map((column) => (
                           <TableCell
                              align="left"
                              key={column.id}
                              style={{ minWidth: column.minWidth }} >
                              {column.label}
                           </TableCell>
                        ))}
                     </TableRow>
                  </TableHead>

                  <TableBody>
                     {
                        rows.length === 0 ? "No Matches" :
                           rows.map((row, index) => (
                              <TableRow key={index}  >
                                 <TableCell align="left" style={{ minWidth: "100px" }}>{row.name}</TableCell>
                                 <TableCell align="left" style={{ minWidth: "100px" }}>{row.court}</TableCell>
                                 <TableCell align="left" style={{ minWidth: "100px" }}>{row.price}</TableCell>
                                 <TableCell align="left" style={{ minWidth: "100px" }}>{row.booking_date}</TableCell>
                                 <TableCell align="left" style={{ minWidth: "100px" }}>{row.booking_hours}</TableCell>
                                 <TableCell align="left" style={{ minWidth: "100px" }}>{row.incoming_date}</TableCell>
                                 <TableCell align="left" style={{ minWidth: "100px" }}>{row.sport_type}</TableCell>
                                 <TableCell align="left" style={{ minWidth: "100px" }} >
                                    <Stack direction="row" spacing={2}  >
                                       <Button variant="outlined" color="success">Accept</Button>
                                       <Button variant="outlined" color="error">Deny</Button>
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