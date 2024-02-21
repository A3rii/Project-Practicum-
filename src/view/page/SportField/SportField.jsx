import { useState } from "react";
import { Link } from "react-router-dom"
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TimePicker from "../../../components/TimePicker/TimePicker";
import DatePicker from "../../../components/DatePicker/DatePicker";
import FootballCourt from "./../../../assets/BookingImags/pic12.jpg"



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
         <Table sx={{
            width: 1200,
         }}
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
      </ TableContainer>
   );
}



export default function SportField() {
   // eslint-disable-next-line no-unused-vars
   const [courtType, setCourtType] = useState("Select Court Type");


   // eslint-disable-next-line no-unused-vars
   const [courtOptions, setCourtOptions] = useState([
      "Indoor Court",
      "Outdoor 6v6",
      "Outdoor 11v11",
   ]);





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
            <div className="date-time">
               <div className="sport-date">
                  <DatePicker />
               </div>
               <div className="sport-time">
                  <TimePicker />
               </div>
               <div className="date-time-btn">
                  <button type="button" className="btn btn-danger btn-lg"> Search </button>
               </div>
            </div>
         </div>

         <div className="sport-schedule">
            <h2> ALL OF OUR FOOTBALL SCHEDULE </h2>
            <div className="sportField-schedule">
               <AccessibleTable />
            </div>
            <Link to="/Payment">
               <button className="btn btn-danger btn-lg" >Book Now</button>
            </Link>
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
               <button type="button" className="btn btn-success btn-lg"> Contact Now </button>
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
