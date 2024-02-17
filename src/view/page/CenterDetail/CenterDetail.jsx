import * as React from 'react';
import Header from "../../../components/Header/Header"
import Footer from "../../../components/Footer/Footer"
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import { red } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import FootBall from "./../../../assets/BookingImags/pic7.jpg"
import Basketball from "./../../../assets/BookingImags/pic9.jpg"
import Badminton from "./../../../assets/BookingImags/pic10.jpg"
import { Link } from "react-router-dom"
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


function RatingSkeletons() {
   const [value, setValue] = React.useState(2);
   return (
      <>
         <Card sx={{ maxWidth: 345 }}>
            <CardHeader
               avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                     R
                  </Avatar>
               }
               title="Sim Sen Chamroung"
               subheader="September 14, 2016"
            />
            <CardContent>
               <Typography variant="body2" color="text.secondary">
                  Dont come to this place it is dirty
               </Typography>
            </CardContent>
            <Box
               sx={{
                  '& > legend': { ml: 2 },
               }}
            >
               <Typography variant="body2" color="text.secondary" component="legend">User Rating</Typography>
               <Rating sx={{ ml: 1 }} name="read-only" value={value} readOnly />
            </Box>
         </Card>
      </>
   )
}



// eslint-disable-next-line react/prop-types
function CenterCard({ image, type, time, price }) {
   return (
      <Card sx={{ width: 300 }}>
         <CardMedia
            sx={{ height: 250 }}
            image={image}
            title="Sport Category"
         />
         <CardContent>
            <Typography gutterBottom variant="h5" component="div">
               {type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
               <i className="fa-regular fa-calendar-check" style={{ marginRight: '12px' }}></i>
               {time}
            </Typography>
            <Typography variant="body2" color="text.secondary" >
               <i className="fa-solid fa-calendar-days" style={{ marginRight: '12px' }}></i>
               {price}
            </Typography>
         </CardContent>
         <CardActions>
            <Link to="/sportField">
               <Button variant="outlined" color="error" >
                  Explore more
               </Button>
            </Link>
         </CardActions>
      </Card>
   )
}
export default function CenterDetail() {
   const [value, setValue] = React.useState(2);
   return (
      <>
         <div className="center-header" >
            <Header />
            <div className="center-banner">
               <h2> Welcome to Phnom Penh Sport Center</h2>
               <span> This is a site where you can all book your sport field with ease and quick services.</span>
               <div className="center-location">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>Toul Kork, Phnom Penh </span>
               </div>
            </div>
         </div>

         <div className="center-category">
            <h2> Our Sport Services </h2>
            <div className="center-cardSport">
               <CenterCard
                  image={FootBall}
                  type="FOOTBALL"
                  time="Available: 7AM - 9PM"
                  price="20$ per 90 minutes"
               />

               <CenterCard
                  image={Basketball}
                  type="BASKETBALL"
                  time="Available: 7AM - 9PM"
                  price="10$ per 60 minutes"
               />

               <CenterCard
                  image={Badminton}
                  type="BADMINTON"
                  time="Available: 7AM - 9PM"
                  price="20$ per 90 minutes"
               />

            </div>
         </div>

         <div className="center-map" >
            <div className="center-googleMap" >
               <h2> View the location </h2>
               <span> You can find the sport center by viewing through this map</span>
               <button type="button" className="btn btn-danger btn-lg"> View Map</button>
            </div>
         </div>



         <div className="center-rating">
            <h2> Client Review</h2>
            <div className="center-comment" >
               <RatingSkeletons />
               <RatingSkeletons />
               <RatingSkeletons />
            </div>

         </div>
         <div className='center-client-comments'>
            <h2>Your FeedBack </h2>
            <input type="text"
               className="client-feedback"
               placeholder='Feedback....'
            />
            <div className="center-client-rating">
               <span>Rating </span>
               <Rating
                  name="simple-controlled"
                  value={value}
                  onChange={(event, newValue) => {
                     setValue(newValue);
                  }}
               />
            </div>
            <button type="submit" className="mt-5 btn btn-danger">Submit</button>
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
   )
}
