import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./view/page/Home/Home";
import AdminCenter from "./view/page/AdminCenter/AdminCenter";
import Booking from "./view/page/Booking/Booking";
import CenterDetail from "./view/page/CenterDetail/CenterDetail";
import SportField from "./view/page/SportField/SportField";
import Payment from "./view/page/Payment/Payment";
import Login from "./view/page/Login/Login";
import SignUp from "./view/page/SignUp/SignUp";
import Contact from "./view/page/Contact/Contact";
import Lessor from "./view/page/Lessor/Lessor";
import Reciept from "./view/page/RecieptPage/TicketPage";
import HomeDash from "./view/page/AdminCenter/HomeDash";
import SetTime from "./view/page/AdminCenter/SetTime";
import IncomingMatch from "./view/page/AdminCenter/IncomingMatch";
import ConfirmPage from "./view/page/AdminCenter/ComfirmPage";
import ConfirmMatch from "./view/page/AdminCenter/ConfirmMatch";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} exact />

        <Route path="/admin" element={<AdminCenter />}>
          <Route index element={<HomeDash />} />
          <Route path="/admin/dashboard" element={<HomeDash />} />
          <Route path="/admin/confirm_match" element={<ConfirmMatch />}>
            <Route index element={<ConfirmPage />} />
            <Route
              path="/admin/confirm_match/confirm"
              element={<ConfirmPage />}
            />
            <Route
              path="/admin/confirm_match/incoming"
              element={<IncomingMatch />}
            />
          </Route>

          <Route path="/admin/settime" element={<SetTime />} />
        </Route>

        <Route path="/booking" element={<Booking />} />
        <Route path="/sportcenter" element={<CenterDetail />} />
        <Route path="/sportfield" element={<SportField />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/lessor" element={<Lessor />} />
        <Route path="/reciept" element={<Reciept />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}
