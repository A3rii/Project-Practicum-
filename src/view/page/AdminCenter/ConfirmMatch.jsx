import { Link, Outlet } from "react-router-dom";
export default function ComfirmMatch() {
  return (
    <>
      <nav className="confirm-nav">
        <ul>
          <Link to="/confirm_match/confirm">
            <button className="confirm-matching">Comfirm Match</button>
          </Link>

          <Link to="/confirm_match/incoming">
            <button className="confirm-incoming"> Incoming Match </button>
          </Link>
        </ul>
      </nav>

      <Outlet />
    </>
  );
}
