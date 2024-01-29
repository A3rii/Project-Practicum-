import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './view/page/Home/Home';
import Booking from './view/page/Booking/Booking';
import CenterDetail from './view/page/CenterDetail/CenterDetail';
import SportField from './view/page/SportField/SportField';
import Payment from './view/page/Payment/Payment';
import Login from './view/page/Login/Login';
import SignUp from './view/page/SignUp/SignUp';
import Contact from './view/page/Contact/Contact';
import Lessor from './view/page/Lessor/Lessor';
import Reciept from "./view/page/RecieptPage/TicketPage"
const router = createBrowserRouter([
  {
    path: '/',
    exact: true,
    element: <Home />,
  },
  {
    path: '/booking',
    element: <Booking />,
  },
  {
    path: '/sportCenter',
    element: <CenterDetail />,
  },
  {
    path: '/sportField',
    element: <SportField />,
  },

  {
    path: '/Payment',
    element: <Payment />,
  },
  {
    path: '/Login',
    element: <Login />,
  },
  {
    path: '/SignUp',
    element: <SignUp />,
  },

  {
    path: '/Contact',
    element: <Contact />,
  },
  {
    path: '/Lessor',
    element: <Lessor />,
  },
  {
    path: '/reciept',
    element: <Reciept />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
