import "./../../index.css";
import { NavLink } from "react-router-dom";
export default function Header() {
   return (
      <header className="header-container">
         <span className="header-title">Sport Rental</span>
         <i className="fa-solid fa-bars"></i>
         <nav className="header-navbar">
            <ul>
               <NavLink to="/">
                  <li> Home </li>
               </NavLink>
               <NavLink to="/booking">
                  <li>Renting </li>
               </NavLink>
               <NavLink to="/lessor">
                  <li>Lessor</li>
               </NavLink>
               <NavLink to="/contact">
                  <li>Contact</li>
               </NavLink>
               <NavLink to="/reciept">
                  <li> Historys</li>
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
