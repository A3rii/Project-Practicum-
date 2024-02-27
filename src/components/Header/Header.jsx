import "./../../index.css";
import { NavLink } from "react-router-dom";
export default function Header() {
   return (
      <header className="header-container">
         <span className="header-title">Sport Rental</span>
         <nav className="header-navbar">
            <ul>
               <NavLink to="/">
                  <li> Home </li>
               </NavLink>
               <NavLink to="/booking">
                  <li>Renting Facilities</li>
               </NavLink>
               <NavLink to="/lessor">
                  <li>Become Lessor</li>
               </NavLink>
               <NavLink to="/contact">
                  <li>Contact</li>
               </NavLink>
               <NavLink to="/reciept">
                  <li>Booking Historys</li>
               </NavLink>
            </ul>
         </nav>
         <div className="header-auth">
            <NavLink to="/login" className="header-login">Login </NavLink>
            <NavLink to="/signup">
               <button className="header-button">Sign Up </button>
            </NavLink>
         </div>
      </header>
   )
}
