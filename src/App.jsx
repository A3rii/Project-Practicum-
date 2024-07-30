import { Suspense, lazy } from "react";
import "./App.css";
import Loader from "./components/Loader";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Applayout from "./view/applayout/Applayout";

// Lazy load components
const Home = lazy(() => import("./view/page/user/Home"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const AdminCenter = lazy(() => import("./view/page/admin/AdminCenter"));
const Booking = lazy(() => import("./view/page/user/Booking"));
const BookingHistory = lazy(() => import("./view/page/user/BookingHistory"));
const CenterDetail = lazy(() => import("./view/page/user/CenterDetail"));
const SportField = lazy(() => import("./view/page/user/SportField"));
const Payment = lazy(() => import("./view/page/user/Payment"));
const Login = lazy(() => import("./view/page/Auth/Login/Login"));
const SignUpCustomer = lazy(() =>
  import("./view/page/Auth/SignUp/SignUpCustomer")
);
const Contact = lazy(() => import("./view/page/user/Contact"));
const HomeDashboard = lazy(() => import("./view/page/admin/HomeDashboard"));
const IncomingMatch = lazy(() => import("./view/page/admin/IncomingMatch"));
const ConfirmPage = lazy(() => import("./view/page/admin/ComfirmPage"));
const ConfirmMatch = lazy(() => import("./view/page/admin/ConfirmMatch"));
const Schedule = lazy(() => import("./view/page/admin/Schedule"));
const SignInSportAdmin = lazy(() =>
  import("./view/page/Auth/Login/SignInSportAdmin")
);
const SignUpLessor = lazy(() => import("./view/page/Auth/SignUp/SignUpLessor"));
const Facility = lazy(() => import("./view/page/admin/Facility"));
const Profile = lazy(() => import("./view/page/admin/Profile"));
const UserIncomingMatch = lazy(() => import("./view/page/user/IncomingMatch"));
const AllMatch = lazy(() => import("./view/page/user/AllMatch"));
const RejectedMatch = lazy(() => import("./view/page/user/RejectedMatch"));
const AcceptedMatch = lazy(() => import("./view/page/user/AcceptedMatch"));

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Applayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<Loader />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<Loader />}>
                <PageNotFound />
              </Suspense>
            }
          />
          <Route
            path="/booking"
            element={
              <Suspense fallback={<Loader />}>
                <Booking />
              </Suspense>
            }
          />

          <Route
            path="/sportcenter"
            element={
              <Suspense fallback={<Loader />}>
                <CenterDetail />
              </Suspense>
            }>
            <Route
              path=":sportCenterId"
              element={
                <Suspense fallback={<Loader />}>
                  <CenterDetail />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="/facility"
            element={
              <Suspense fallback={<Loader />}>
                <SportField />
              </Suspense>
            }>
            <Route
              path="/facility/:facilityId/sport-center/:sportCenterId"
              element={
                <Suspense fallback={<Loader />}>
                  <SportField />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="/payment"
            element={
              <Suspense fallback={<Loader />}>
                <Payment />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<Loader />}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="/incoming-match"
            element={
              <Suspense fallback={<Loader />}>
                <UserIncomingMatch />
              </Suspense>
            }
          />

          <Route
            path="/match-history"
            element={
              <Suspense fallback={<Loader />}>
                <BookingHistory />
              </Suspense>
            }>
            <Route
              index
              element={
                <Suspense fallback={<Loader />}>
                  <AllMatch />
                </Suspense>
              }
            />
            <Route
              path="all-match"
              element={
                <Suspense fallback={<Loader />}>
                  <AllMatch />
                </Suspense>
              }
            />
            <Route
              path="accepted-match"
              element={
                <Suspense fallback={<Loader />}>
                  <AcceptedMatch />
                </Suspense>
              }
            />
            <Route
              path="rejected-match"
              element={
                <Suspense fallback={<Loader />}>
                  <RejectedMatch />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="/signup-admin"
            element={
              <Suspense fallback={<Loader />}>
                <SignUpLessor />
              </Suspense>
            }
          />
        </Route>

        <Route
          path="/login"
          element={
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<Loader />}>
              <SignUpCustomer />
            </Suspense>
          }
        />
        <Route
          path="/signin-admin"
          element={
            <Suspense fallback={<Loader />}>
              <SignInSportAdmin />
            </Suspense>
          }
        />

        <Route
          path="/admin"
          element={
            <Suspense fallback={<Loader />}>
              <AdminCenter />
            </Suspense>
          }>
          <Route
            index
            element={
              <Suspense fallback={<Loader />}>
                <HomeDashboard />
              </Suspense>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <Suspense fallback={<Loader />}>
                <HomeDashboard />
              </Suspense>
            }
          />
          <Route
            path="/admin/confirm_match"
            element={
              <Suspense fallback={<Loader />}>
                <ConfirmMatch />
              </Suspense>
            }>
            <Route
              index
              element={
                <Suspense fallback={<Loader />}>
                  <ConfirmPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/confirm_match/confirm"
              element={
                <Suspense fallback={<Loader />}>
                  <ConfirmPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/confirm_match/incoming"
              element={
                <Suspense fallback={<Loader />}>
                  <IncomingMatch />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="/admin/schedule"
            element={
              <Suspense fallback={<Loader />}>
                <Schedule />
              </Suspense>
            }
          />
          <Route
            path="/admin/lessor-profile"
            element={
              <Suspense fallback={<Loader />}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/admin/facility"
            element={
              <Suspense fallback={<Loader />}>
                <Facility />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
