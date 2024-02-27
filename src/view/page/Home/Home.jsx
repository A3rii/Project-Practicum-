import HeaderLogin from "./../../../components/Header/HeaderLogin"
import Header from "./../../../components/Header/Header"
import Footer from "./../../../components/Footer/Footer"
import { Link } from "react-router-dom"

import CardSwiper from "../../../components/CardSwiper/CardSwiper"
export default function Home() {
   return (
      <>
         <div className="home-header" >
            <HeaderLogin   />
            <div className="home-banner">
               <h2> Welcome to Sport Renting Site</h2>
               <span> This is a site where you can all book your sport field with ease and quick services.</span>
               <Link to="/booking" >
                  <button type="button" className="home-bookBtn" >Book Now</button>
               </Link>
            </div>
         </div>


         <div className="home-map" >
            <div className="home-googleMap" >
               <h2> View The Nearest Sport Center </h2>
               <span> You can find the sport center by viewing through this map</span>
               <button type="button" className="home-viewmap"> View Map</button>
            </div>
         </div>


         <div className="home-processing" >
            <div className="home-process" >
               <h2> How does it works? </h2>
               <div className="home-processes">
                  <div className="home-mapping" >
                     <i className="fa-solid fa-map-location-dot"></i>
                     <span> Find a sport fields that are suitable for you </span>
                  </div>
                  <div className="home-schedule" >
                     <i className="fa-solid fa-clock"></i>
                     <span> Select an available schedule </span>
                  </div>
                  <div className="home-booking" >
                     <i className="fa-solid fa-book-bookmark"></i>
                     <span>Confirm your booking with the renter </span>
                  </div>

               </div>
            </div>
         </div>



         <div className="home-rental">
            <h1>Lessor</h1>
            <div className="home-lessorBtn">
               <Link to="/lessor">
                  <button className="home-rentalButton" >Become A Lessor </button>
               </Link>
               <a href="#"> Contact Us Now</a>
            </div>
            <span>Advertising your sport center in this site, offering online rental places, making your sport center noticeable </span>
            <div className="home-verify">
               <div className="home-checked">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Build of Trust</span>
               </div>
               <div className="home-popularity">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Gain popularity </span>

               </div>

               <div className="home-offer">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Best offer between customer </span>
               </div>

            </div>
         </div>


         <div className="home-service">
            <h2> Explore The  <span className="home-redSpan">Services</span> </h2>
            <CardSwiper />
         </div>


         <Footer />
      </>

   );
}
