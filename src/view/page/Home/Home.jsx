import Header from "./../../../components/Header/Header"
import Footer from "./../../../components/Footer/Footer"
import { Link } from "react-router-dom"

import CardSwiper from "../../../components/CardSwiper/CardSwiper"
export default function Home() {
   return (
      <>
         <div className="home-header" >
            <Header />
            <div className="home-banner">
               <h2> Welcome to Sport Renting Site</h2>
               <span> This is a site where you can all book your sport field with ease and quick services.</span>
               <Link to="/booking" >
                  <button type="button" className="home-bookBtn" >Book Now</button>
               </Link>
            </div>
         </div>

         {/* <div className="home-searchCenter">
            <h1>Convenient & Flexible Scheduling</h1>
            <span> Find and book your courts conveniently with our online system that matches your schedule and location. </span>

            <div className="home-searchLocation">
               <div className="home-searchCatogory">
                  <h2>Sport Category</h2>
                  <input
                     type="text"
                     placeholder="Choose Type of Sports"
                     className="home-inputType"

                  />
               </div>
               <div className="home-searchPlace">
                  <h2>Where</h2>
                  <input
                     type="text"
                     placeholder="Find Your Location"
                     className="home-inputType"

                  />
               </div>
               <button type="submit" className="btn btn-danger btn-search" >
                  <i className="fa-solid fa-magnifying-glass"></i>
               </button>
            </div>
         </div> */}

         <div className="home-map" >
            <div className="home-googleMap" >
               <h2> View The Nearest Sport Center </h2>
               <span> You can find the sport center by viewing through this map</span>
               <button type="button" className="btn btn-danger btn-lg"> View Map</button>
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
               <Link to="/Lessor">
                  <button className="btn btn-danger btn-lg" >Become A Lessor </button>
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
