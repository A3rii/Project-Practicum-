import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';
import FootballCourt from "./../../../assets/BookingImags/pic12.jpg"
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Link } from "react-router-dom"
import { useState } from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';


function createData(name, timeAvailibilty_1, timeAvailibilty_2, timeAvailibilty_3, timeAvailibilty_4) {
   return { name, timeAvailibilty_1, timeAvailibilty_2, timeAvailibilty_3, timeAvailibilty_4 };
}

const rows = [
   createData('8:00 AM - 9:30 AM', "Available", "A", "A", "A"),
   createData('9:30 AM - 11 AM', "Available", "Available", "Available", "A"),
   createData('3:00 AM - 4:30 PM', "Available", "A", "Available", "Available"),
   createData('4:30 PM - 6 PM', "Available", "Available", "A", "Available"),
   createData('6:00 PM- 7:30 PM', "Available", "A", "A", "Available"),
   createData('7:30 PM- 9:00 PM', "Available", "A", "Available", "A"),
];

function AccessibleTable() {
   return (
      <TableContainer component={Paper}  >
         <Table
            style={{ height: '450px' }}
            aria-label="caption table">
            <TableHead>
               <TableRow>
                  <TableCell> 30 - NOV - 2024</TableCell>
                  <TableCell align="right">Indoor Court A </TableCell>
                  <TableCell align="right">Indoor Court B</TableCell>
                  <TableCell align="right">Outdoor&nbsp;(6v6) </TableCell>
                  <TableCell align="right">Outdoor&nbsp;(11v11)</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {rows.map((row) => (
                  <TableRow key={row.name}>
                     <TableCell component="th" scope="row">
                        {row.name}
                     </TableCell>
                     <TableCell align="right">{row.timeAvailibilty_1}</TableCell>
                     <TableCell align="right">{row.timeAvailibilty_2}</TableCell>
                     <TableCell align="right">{row.timeAvailibilty_3}</TableCell>
                     <TableCell align="right">{row.timeAvailibilty_4}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   );
}



export default function SportField() {
   const [value, setValue] = useState(dayjs());
   const [court, setCourt] = useState(null);

   const handleOnSelectCourt = (e) => {
      setCourt(e.target.value);
   }


   const handleDateChange = (newDate) => {
      setValue(newDate);
   };

   const names = [
      'Court A',
      'Court B',
      'Court 11 v 11',
      'Court 5 v 5'
   ];


   return (
      <>
         <div className="sportField-header">
            <Header />
            <div className="sportField-banner">
               <h2> FOOTBALL </h2>
               <span>
                  Comfortable field and have various field choices, including indoor
                  and outdoor 6v6 fields and outdoor 11v11. Mostly busy during 5-8
                  PM, always full on weekends.
               </span>
            </div>

            {/** Date and Time */}
            <div className="sport-reserve">

               <div className="date-time">
                  <div className="sport-date">
                     <LocalizationProvider
                        dateAdapter={AdapterDayjs}>
                        <DemoContainer
                           components={['DateCalendar']}>
                           <DateCalendar
                              sx={{ widht: "100%" }}
                              value={value}
                              onChange={handleDateChange}
                           />
                        </DemoContainer>
                     </LocalizationProvider>

                  </div>

                  <div className="selected-date">
                     <TextField
                        sx={{ marginBottom: "15px", width: "100%" }}
                        value={value.format('MMMM DD, YYYY')}
                        readOnly
                     />
                  </div>

                  <div className="sport-time">
                     <LocalizationProvider
                        dateAdapter={AdapterDayjs}>
                        <TimePicker label="From" />
                        <TimePicker label="Till" />
                     </LocalizationProvider>

                  </div>
                  <div className="court-type">
                     <FormControl
                        sx={{ width: "100%" }}
                     >
                        <InputLabel>Court</InputLabel>
                        <Select
                           value={court}
                           onChange={handleOnSelectCourt}
                           input={<OutlinedInput label="Court" />}
                        >
                           {names.map((name) => (
                              <MenuItem
                                 key={name}
                                 value={name}
                              >
                                 {name}

                              </MenuItem>
                           ))}
                        </Select>
                     </FormControl>
                  </div>
                  <Link to="/payment">
                     <button type="button" className="sportField-reserver">Reserve</button>
                  </Link>

               </div>
            </div>
         </div>

         <div className="sport-schedule">
            <h2> ALL OF OUR FOOTBALL SCHEDULE </h2>
            <div className="sportField-schedule">
               <AccessibleTable />
            </div>
         </div>


         <div className="sportField-Slider">
            <h2> Our Football View </h2>
            <div className="sportField-slider">
               <div id="carouselExampleIndicators" className="carousel slide">
                  <div className="carousel-indicators">
                     <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                     <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                     <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                  </div>
                  <div className="carousel-inner sportField-carousel">
                     <div className="carousel-item active">
                        <img src={FootballCourt} className="d-block rounded " alt="#" />
                     </div>
                     <div className="carousel-item">
                        <img src={FootballCourt} className="d-block rounded" alt="#" />
                     </div>
                     <div className="carousel-item">
                        <img src={FootballCourt} className="d-block rounded" alt="#" />
                     </div>
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                     <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                     <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                     <span className="carousel-control-next-icon" aria-hidden="true"></span>
                     <span className="visually-hidden">Next</span>
                  </button>
               </div>
            </div>
         </div>

         <div className="center-contact">
            <div></div>
            <div className="center-contactInfo">
               <button type="button" className="center-buttonContact  "> Contact Now </button>
               <div className="center-contactDetails">
                  <span> (+885) 23-880-880 </span>
                  <span> Email: PhnompenhSport Center @gmail.com  </span>
               </div>
            </div>
            <div className="center-socialMedia">
               <i className="fa-brands fa-telegram"></i>
               <i className="fa-brands fa-facebook"></i>
            </div>
         </div>

         <Footer />

      </>
   );
}
