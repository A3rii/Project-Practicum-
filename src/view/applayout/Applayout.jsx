import Header from "../../components/Header/Header";
import Footer from "../../components/Footer";
import HeaderLogin from "../../components/Header/HeaderLogin";
import { Outlet } from "react-router-dom";
import currentUser from "../../utils/currentUser";

export default function Applayout() {
  const getCurrentUser = currentUser();
  return (
    <>
      <div className="app-layout">
        {getCurrentUser ? <HeaderLogin /> : <Header />}
        <Outlet />
        <Footer />
      </div>
    </>
  );
}
