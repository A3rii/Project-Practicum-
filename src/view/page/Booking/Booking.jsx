import Header from "./../../../components/Header/Header"
import Footer from "./../../../components/Footer/Footer"
import SportCenter from "./../../../assets/BookingImags/pic2.jpg"
import GreenSport from "./../../../assets/BookingImags/pic3.jpg"
import LightSport from "./../../../assets/BookingImags/pic4.jpg"
import MalisSport from "./../../../assets/BookingImags/pic5.jpg"
import { Link } from "react-router-dom"
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function SelectionOption({ type, option1, option2, option3 }) {
   const [option, setOption] = React.useState('');

   const handleChange = (event) => {
      setOption(event.target.value);
   };
   return (
      <Box sx={{ minWidth: 120 }}>
         <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{type}</InputLabel>
            <Select
               labelId="demo-simple-select-label"
               id="demo-simple-select"
               value={option}
               label={type}
               onChange={handleChange}
            >
               <MenuItem value={10}>{option1}</MenuItem>
               <MenuItem value={20}>{option2}</MenuItem>
               <MenuItem value={30}>{option3}</MenuItem>
            </Select>
         </FormControl>
      </Box>
   )
}

function SportField({ image, title, location, time }) {
   const [value, setValue] = React.useState(3);


   return (

      <div className="booking-category">
         <div className="container booking-sportCenter" >

            <div className="booking-sportImg" >
               <img src={image} alt="#" />
            </div>
            <div className="booking-information" >

               <div className="booking-detail">
                  <h2>{title}</h2>

                  <div className="booking-location">
                     <i className="fa-solid fa-location-dot"></i>
                     <span> {location}</span>
                  </div>

                  <div className="booking-time">
                     <i className="fa-solid fa-clock"></i>
                     <span> {time}</span>
                  </div>

                  <div className="booking-type">
                     <i className="fa-solid fa-volleyball"></i>
                     <span> Sport field: football, volleyball, basketball, etc</span>
                  </div>

                  <Box
                     sx={{
                        '& > legend': { mt: 2.5 },
                     }}
                  >
                     <Typography component="legend">Rating </Typography>
                     <Rating name="read-only" value={value} readOnly />
                  </Box>


               </div>
               <Link to="/sportCenter" >
                  <button type="button" className="btn btn-danger btn-lg booking-btn"> Book Now </button>
               </Link>
            </div>

         </div>
      </div>
   )
}

export default function Booking() {
   return (
      <>
         <div className="booking-header" >
            <Header />
            <div className="booking-banner">
               <h2> Welcome to Sport Center</h2>
            </div>
         </div>


         <div className="container  booking-field" >
            <h2>Sport Field Rental</h2>
            <div className="booking-filter" >
               <i className="fa-solid fa-magnifying-glass"></i>
               <input type="text" placeholder="Search here..." />
               <button className="button">Search</button>
            </div>

            <div className="booking-filter-type">
               <SelectionOption
                  type="SportType"
                  option1="Football"
                  option2="Volleyball"
                  option3="Basketball"
               />


               <SelectionOption
                  type="Time Available"
                  option1="All"
                  option2="Openend"
               />

               <SelectionOption
                  type="Location"
                  option1="All"
                  option2="Nearest"
               />
            </div>



            <SportField
               image={SportCenter}
               title="Phnom Penh Sport Center"
               location="Toul Kork, Phnom Penh"
               time="Time Open:  6am-9pm"

            />
            <SportField
               image={GreenSport}
               title="The Green Sport Club "
               location="Address 51, Sangkat Chroy Chongva, Phnom Penh"
               time="Time Open:  6am-9pm"

            />

            <SportField
               image={LightSport}
               title="The Light Sports"
               location="Sangkat Prek Pra, Khan Chbar Ampov,Phnom Penh"
               time="Time Open:  6am-9pm"

            />

            <SportField
               image={MalisSport}
               title="Malis Sport Center"
               location="Chamka Doung Street (St. 217) , Phnom Penh"
               time="Time Open:  6am-9pm"

            />
         </div>

         <Footer />

      </>

   );
}

