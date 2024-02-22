import { Link, Outlet } from "react-router-dom";
export default function ComfirmMatch() {


   return (
      <>

         <nav className="confirm-nav">
            <ul>
               <Link to="/confirm_match/confirm">
                  <button className="btn btn-primary">Comfirm Match</button>
               </Link>


               <Link to="/confirm_match/incoming">
                  <button className="btn btn-primary"> Incoming Match </button>
               </Link>

            </ul>
         </nav>

         <Outlet />

      </>
   );
}