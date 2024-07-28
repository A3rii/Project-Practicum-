import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./view/page/user/Home";
import AdminCenter from "./view/page/admin/AdminCenter";
import Applayout from "./view/applayout/Applayout";
import Booking from "./view/page/user/Booking";
import BookingHistory from "./view/page/user/BookingHistory";
import CenterDetail from "./view/page/user/CenterDetail";
import SportField from "./view/page/user/SportField";
import Payment from "./view/page/user/Payment";
import Login from "./view/page/Auth/Login/Login";
import SignUpCustomer from "./view/page/Auth/SignUp/SignUpCustomer";
import Contact from "./view/page/user/Contact";
import HomeDashboard from "./view/page/admin/HomeDashboard";
import IncomingMatch from "./view/page/admin/IncomingMatch";
import ConfirmPage from "./view/page/admin/ComfirmPage";
import ConfirmMatch from "./view/page/admin/ConfirmMatch";
import Schedule from "./view/page/admin/Schedule";
import SignInSportAdmin from "./view/page/Auth/Login/SignInSportAdmin";
import SignUpLessor from "./view/page/Auth/SignUp/SignUpLessor";
import Facility from "./view/page/admin/Facility";
import Profile from "./view/page/admin/Profile";
import UserIncomingMatch from "./view/page/user/IncomingMatch";
import RejectedMatch from "./view/page/user/RejectedMatch";
import AcceptedMatch from "./view/page/user/AcceptedMatch";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Applayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />

          <Route path="/sportcenter" element={<CenterDetail />}>
            <Route path=":sportCenterId" element={<CenterDetail />} />
          </Route>

          <Route path="/facility" element={<SportField />}>
            <Route
              path="/facility/:facilityId/sport-center/:sportCenterId"
              element={<SportField />}
            />
          </Route>

          <Route path="/payment" element={<Payment />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/match-history" element={<BookingHistory />}>
            <Route index element={<UserIncomingMatch />} />
            <Route path="incoming-user-match" element={<UserIncomingMatch />} />
            <Route path="accepted-match" element={<AcceptedMatch />} />
            <Route path="rejected-match" element={<RejectedMatch />} />
          </Route>

          <Route path="/signup-admin" element={<SignUpLessor />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpCustomer />} />
        <Route path="/signin-admin" element={<SignInSportAdmin />} />

        <Route path="/admin" element={<AdminCenter />}>
          <Route index element={<HomeDashboard />} />
          <Route path="/admin/dashboard" element={<HomeDashboard />} />
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

          <Route path="/admin/schedule" element={<Schedule />} />
          <Route path="/admin/lessor-profile" element={<Profile />} />
          <Route path="/admin/facility" element={<Facility />} />
        </Route>
      </Routes>
    </Router>
  );
}
