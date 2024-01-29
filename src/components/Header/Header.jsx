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
               <NavLink to="/Lessor">
                  <li>Become Lessor</li>
               </NavLink>
               <NavLink to="/Contact">
                  <li>Contact</li>
               </NavLink>
               <NavLink to="/Reciept">
                  <li>Booking Historys</li>
               </NavLink>
            </ul>
         </nav>
         <div className="header-auth">
            <NavLink to="/Login" className="header-login">Login </NavLink>
            <NavLink to="/SignUp">
               <button className="btn btn-danger btn-lg header-button">Sign Up </button>
            </NavLink>
         </div>
      </header>
   )
}
