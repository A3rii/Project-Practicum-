import "./../../index.css";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
export default function Header() {
   const [open, setOpen] = useState(false);
   let menuRef = useRef();

   useEffect(() => {
      let handler = (e) => {
         if (!menuRef.current.contains(e.target) && open) {
            setOpen(false);
         }
      };

      document.addEventListener("mousedown", handler);

      return () => {
         document.removeEventListener("mousedown", handler);
      };
   }, [open]);


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

            </ul>
         </nav>


         <div className="header-auth">
            <div className="app-menu">
               <div className='app-menu-container' ref={menuRef}>
                  <div className='app-menu-trigger' onClick={() => { setOpen(!open) }}>
                     <img src="#" alt="User Icon"></img>
                  </div>

                  <div className={`app-dropdown-sidemenu ${open ? 'active' : 'inactive'}`} >
                     <h3 className="dealer-name">Kimly</h3>
                     <ul className='dealer-option'>
                        <DropdownItem img="" text={"Profile"} />
                        <DropdownItem img="" text={"Incomoing"} />
                        <DropdownItem img="" text={"History"} />
                     </ul>
                     <button className="btn btn-danger" >Sign Out</button>
                  </div>
               </div>
            </div>
         </div>
      </header>
   )
}
function DropdownItem(prop) {
   return (
      <li className='app-dropdownItem'>
         <img src="" alt=""></img>
         <a href="!#">{prop.text} </a>
      </li>
   );
}
