import { Link, Outlet } from "react-router-dom";
export default function ComfirmMatch() {


   return (
      <>

         <nav className="confirm-nav">
            <ul>
               <Link to="/confirm_match/confirm">
                  <li>Comfirm Match</li>
               </Link>
               <Link to="/confirm_match/incoming">
                  <li> Incoming Match </li>
               </Link>


            </ul>
         </nav>
         <Outlet />

      </>
   );
}