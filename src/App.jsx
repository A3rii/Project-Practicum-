import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Loader from "./components/Loader";
import Applayout from "./view/applayout/Applayout";
import AdminProtectedRoute from "./utils/ProtectedRouteAdmin";
import UserProtectedRoute from "./utils/ProtectedRouteUser";
import ProtectedRouteModerator from "./utils/ProtectedRouteModerator";
import Home from "./view/page/user/Home";
import Contact from "./view/page/user/Contact";
import AdminCenter from "./view/page/admin/AdminCenter";
import Booking from "./view/page/user/Booking";
import SignUpLessor from "./view/page/Auth/SignUp/SignUpLessor";
import SignUpCustomer from "./view/page/Auth/SignUp/SignUpCustomer";
import Login from "./view/page/Auth/Login/Login";
import SignInSportAdmin from "./view/page/Auth/Login/SignInSportAdmin";
import PageNotFound from "./components/PageNotFound";
import ProtectedPage from "./components/ProtectedPage";
import Error from "./components/Error";
import LoginSuperAdmin from "./view/page/superadmin/auth/Login";
import SuperAdmin from "./view/page/superadmin/Sidebar";


// Moderator 
const Comment = lazy(() => import("./view/page/superadmin/Comment"));
const DashBoard = lazy(() => import("./view/page/superadmin/DashBoard"));
const ConfirmLessor = lazy(() =>
  import("./view/page/superadmin/ConfirmLessor")
);

// Lazy load components
const BookingHistory = lazy(() => import("./view/page/user/BookingHistory"));
const CenterDetail = lazy(() => import("./view/page/user/CenterDetail"));
const SportField = lazy(() => import("./view/page/user/SportField"));
const Payment = lazy(() => import("./view/page/user/Payment"));

const HomeDashboard = lazy(() => import("./view/page/admin/HomeDashboard"));
const IncomingMatch = lazy(() => import("./view/page/admin/IncomingMatch"));
const ConfirmPage = lazy(() => import("./view/page/admin/ComfirmPage"));
const ConfirmMatch = lazy(() => import("./view/page/admin/ConfirmMatch"));
const Schedule = lazy(() => import("./view/page/admin/Schedule"));

const Facility = lazy(() => import("./view/page/admin/Facility"));
const Profile = lazy(() => import("./view/page/admin/Profile"));
const UserIncomingMatch = lazy(() => import("./view/page/user/IncomingMatch"));
const AllMatch = lazy(() => import("./view/page/user/AllMatch"));
const RejectedMatch = lazy(() => import("./view/page/user/RejectedMatch"));
const AcceptedMatch = lazy(() => import("./view/page/user/AcceptedMatch"));

function RedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/super-admin") {
      navigate("/signin-moderator");
    }
  }, [location, navigate]);

  return null;
}

export default function App() {
  return (
    <Router>
      <RedirectHandler />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpCustomer />} />
          <Route path="/signin-admin" element={<SignInSportAdmin />} />
          <Route path="/signin-moderator" element={<LoginSuperAdmin />} />

          {/* Super Admin Routes */}
          <Route element={<ProtectedRouteModerator />}>
            <Route path="/super-admin" element={<SuperAdmin />}>
              <Route path="dashboard" index element={<DashBoard />} />
              <Route path="comment" element={<Comment />} />
              <Route path="lessor" element={<ConfirmLessor />} />
            </Route>
          </Route>

          {/* Applayout */}
          <Route element={<Applayout />}>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/protected" element={<ProtectedPage />} />
            <Route path="/error" element={<Error />} />
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
            <Route element={<UserProtectedRoute />}>
              <Route path="/incoming-match" element={<UserIncomingMatch />} />
              <Route path="/match-history" element={<BookingHistory />}>
                <Route index element={<AllMatch />} />
                <Route path="all-match" element={<AllMatch />} />
                <Route path="accepted-match" element={<AcceptedMatch />} />
                <Route path="rejected-match" element={<RejectedMatch />} />
              </Route>
            </Route>
            <Route path="/signup-admin" element={<SignUpLessor />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
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
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
