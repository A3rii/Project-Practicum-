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
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

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
function SportFieldCard({ image, title, location, time }) {
   return (
      <Card sx={{ width: 340 }}>
         <CardMedia
            sx={{ height: 250 }}
            image={image}
            title={title}
         />
         <CardContent>
            <Typography gutterBottom variant="h5" component="div">
               {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
               {location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
               {time}
            </Typography>
         </CardContent>
         <CardActions>
            <Link to="/sportCenter" >
               <button type="button" className="btn btn-danger  booking-btn"> Book Now </button>
            </Link>
         </CardActions>
      </Card>
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



            <SportFieldCard
               image={SportCenter}
               title="Phnom Penh Sport Center"
               location="Toul Kork, Phnom Penh"
               time="Time Open:  6am-9pm"

            />

         </div>

         <Footer />

      </>

   );
}

