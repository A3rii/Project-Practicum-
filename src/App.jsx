import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './view/page/Home/Home';
import AdminCenter from './view/page/AdminCenter/AdminCenter';
import Booking from './view/page/Booking/Booking';
import CenterDetail from './view/page/CenterDetail/CenterDetail';
import SportField from './view/page/SportField/SportField';
import Payment from './view/page/Payment/Payment';
import Login from './view/page/Login/Login';
import SignUp from './view/page/SignUp/SignUp';
import Contact from './view/page/Contact/Contact';
import Lessor from './view/page/Lessor/Lessor';
import Reciept from "./view/page/RecieptPage/TicketPage"
import HomeDash from "./view/page/AdminCenter/HomeDash"
import SetTime from './view/page/AdminCenter/SetTime';
import Schedule from './view/page/AdminCenter/Schedule';
import IncomingMatch from './view/page/AdminCenter/IncomingMatch';
import ConfirmPage from "./view/page/AdminCenter/ComfirmPage"
import ConfirmMatch from "./view/page/AdminCenter/ConfirmMatch"
function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<AdminCenter />} exact >

          <Route path="/dashboard" element={<HomeDash />} />


          <Route path="/confirm_match" element={<ConfirmMatch />} >
            <Route path="/confirm_match/incoming" element={<IncomingMatch />} />
            <Route path="/confirm_match/confirm" element={<ConfirmPage />} />
          </Route>


          <Route path="/schedule" element={<Schedule />} />
          <Route path="/settime" element={<SetTime />} />

        </Route>

        <Route path="/booking" element={<Booking />} />
        <Route path="/sportCenter" element={<CenterDetail />} />
        <Route path="/sportField" element={<SportField />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Lessor" element={<Lessor />} />
        <Route path="/reciept" element={<Reciept />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </Router>
  )
}

export default App;
